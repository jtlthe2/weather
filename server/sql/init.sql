create extension if not exists "uuid-ossp";

drop table if exists weather_user;
create table weather_user (
    id uuid primary key default uuid_generate_v4 () not null,
    created_at timestamp default current_timestamp not null,
    updated_at timestamp,
    username text unique,
    weather_units text default 'imperial'
);
comment on table weather_user is 'Table that stores username. Authentication not implemented yet. weather_user relates to weather_location in a many-many relation.';
comment on column weather_user.username is 'Unique. Sole way of user to identify themself.';
comment on column weather_user.weather_units is 'The units the user would like the weather displayed in. Currently defaults to "imperial."';

drop table if exists weather_location;
create table weather_location(
    id uuid primary key default uuid_generate_v4 () not null,
    created_at timestamp default current_timestamp not null,
    updated_at timestamp,
    location_name text not null,
    location_country text not null,
    location_state text,
    lat double precision not null,
    lon double precision not null
);
comment on table weather_location is 'Table that stores the location data. Each row is unique on the combination of location_name, location_country, location_state (if applicable).';
comment on column weather_location.location_name is 'The column that stores the name of the city or location provided by the openweather api.';
comment on column weather_location.location_country is 'The column that stores the country provided by the openweather api.';
comment on column weather_location.location_state is 'The column that stores the state provided by the openweather api (if in the us).';
comment on column weather_location.lat is 'The column that stores the latitude provided by the openweather api.';
comment on column weather_location.lon is 'The column that stores the longitude provided by the openweather api.';
--https://stackoverflow.com/a/8289253
create unique index name_country_state_constraint_idx on weather_location (location_name, location_country, location_state) where location_state is not null;
create unique index name_country_no_state_constraint_idx on weather_location (location_name, location_country) where location_state is null;


drop table if exists weather_user__weather_location;
create table weather_user__weather_location(
    id uuid primary key default uuid_generate_v4 () not null,
    created_at timestamp default current_timestamp not null,
    updated_at timestamp,
    weather_user_id uuid not null references weather_user (id) on delete cascade,
    weather_location_id uuid not null references weather_location (id) on delete cascade,
    unique(weather_user_id, weather_location_id)
);
comment on table weather_user__weather_location is 'Table that stores the many-many relationship between users and locations. Each row is a unique combination of weather_user_id and weather_location_id.';
comment on column weather_user__weather_location.weather_user_id is 'The foreign key referencing the weather_user table.';
comment on column weather_user__weather_location.weather_location_id is 'The foreign key referencing the weather_location table.';
create index user_list_item_weather_user_id_idx on weather_user__weather_location (weather_user_id);
create index user_list_item_weather_location_id_idx on weather_user__weather_location (weather_location_id);

insert into weather_user (username) values ('jtlthe2');
insert into weather_location (location_name, location_country, lat, lon) values ('Tokyo', 'JP', 35.6895, 139.6917);
insert into weather_location (location_name, location_state, location_country, lat, lon) values ('Lexington', 'KY', 'US', 37.9887, -84.4777);
insert into weather_user__weather_location (weather_user_id, weather_location_id) values (
    (select id from weather_user where username = 'jtlthe2'),
    (select id from weather_location where location_name = 'Tokyo' and location_country = 'JP')
);
insert into weather_user__weather_location (weather_user_id, weather_location_id) values (
    (select id from weather_user where username = 'jtlthe2'),
    (select id from weather_location where location_name = 'Lexington' and location_state = 'KY' and location_country = 'US')
);

drop function if exists get_weather_user_or_create_weather_user(text) cascade;
create function get_weather_user_or_create_weather_user(uname text)
returns weather_user 
language plpgsql
as 
$$
declare
    v_user weather_user;
begin
    select * into v_user from weather_user where username = uname;
    if not found then
        insert into weather_user (username) values (uname) returning * into v_user;
    end if;
    return v_user;
end
$$;
comment on function get_weather_user_or_create_weather_user(text) is 'Ether returns the weather_user with the given username or creates a user with the username (and returns that).';

drop function if exists get_weather_locations_for_weather_user(text) cascade;
create function get_weather_locations_for_weather_user(uname text)
returns setof weather_location
language plpgsql
stable
as
$$
begin
    return query select weather_location.*
        from weather_location 
            join weather_user__weather_location on weather_user__weather_location.weather_location_id = weather_location.id 
            join weather_user on weather_user__weather_location.weather_user_id = weather_user.id 
        where weather_user.username = uname;
end
$$;
comment on function get_weather_locations_for_weather_user(text) is 'Returns the list of weather locations (and their units) associated with a user (this can be empty).';

drop function if exists get_weather_location_or_create_weather_location(text, text, double precision, double precision, text) cascade;
create function get_weather_location_or_create_weather_location(l_name text, l_country text, l_lat double precision, l_lon double precision, l_state text default null)
returns weather_location 
language plpgsql
as 
$$
declare
    v_location weather_location;
begin
    if l_state is null then
        select * into v_location from weather_location where location_name = l_name and location_country = l_country;
        if not found then
            insert into weather_location 
            (lat, lon, location_name, location_country) 
            values (l_lat, l_lon, l_name, l_country) 
            returning * into v_location;
        end if;
    else 
        select * into v_location from weather_location where location_name = l_name and location_state = l_state and location_country = l_country;
        if not found then
            insert into weather_location 
            (lat, lon, location_name, location_state, location_country) 
            values (l_lat, l_lon, l_name, l_state, l_country) 
            returning * into v_location;
        end if;
    end if;
    
    return v_location;
end
$$;
comment on function get_weather_location_or_create_weather_location(text, text, double precision, double precision, text) is 'Ether returns the weather_location with the given info or creates a weather_location with the info (and returns that).';

drop function if exists add_location_to_weather_user_list(text, text, text, double precision, double precision, text) cascade;
create function add_location_to_weather_user_list(uname text, l_name text, l_country text, l_lat double precision, l_lon double precision, l_state text default null)
returns weather_location
language plpgsql
as
$$
declare
    v_user weather_user;
    v_location weather_location;
begin
    select * into v_user from weather_user where username = uname;

    -- check this first so we don't add a location if the user doesn't exist.
    if not found then
        raise exception 'username not found in add_location_to_weather_user_list';
    end if;

    v_location := get_weather_location_or_create_weather_location(l_name, l_country, l_lat, l_lon, l_state);

    insert into weather_user__weather_location 
    (weather_user_id, weather_location_id) 
    values (v_user.id, v_location.id);

    return v_location;
end
$$;
comment on function add_location_to_weather_user_list(text, text, text, double precision, double precision, text) is 'Add a location to a users list of locations. If the user does not exist, an error will be raised. If that location does not exist, it will get created.';

drop function if exists remove_location_from_weather_user_list(text, uuid) cascade;
create function remove_location_from_weather_user_list(uname text, l_id uuid)
returns void
language plpgsql
as
$$
declare
    v_user weather_user;
begin
    select * into v_user from weather_user where username = uname;

    -- check this first so we don't add a location if the user doesn't exist.
    if not found then
        raise exception 'username not found in remove_location_from_weather_user_list';
    end if;

    delete from weather_user__weather_location
    where weather_user_id = v_user.id and weather_location_id = l_id;

end
$$;
comment on function remove_location_from_weather_user_list(text, uuid) is 'Remove the location with the given id from the user''s list with the given username.';