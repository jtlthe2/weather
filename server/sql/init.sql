create extension if not exists "uuid-ossp";

drop table if exists weather_user;
create table weather_user (
    id uuid primary key default uuid_generate_v4 () not null,
    created_at default current_timestamp not null,
    updated_at default current_timestamp,
    username text unique
);
comment on table weather_user is 'Table that stores username. Authentication not implemented yet. weather_user relates to weather_location in a many-many relation.';
comment on column weather_user.username is 'Unique. Sole way of user to identify themself.';

drop table if exists weather_location;
create table weather_location(
    id uuid primary key default uuid_generate_v4 () not null,
    created_at default current_timestamp not null,
    updated_at default current_timestamp,
    location_name text not null,
    location_country text not null,
    location_state text,
    lat double precision not null,
    lon double precision not null
);
comment on table weather_location is 'Table that stores the location data. Each row is unique on the combination of location_name, location_country, location_state (if applicable).';
comment on column weather_loaction.location_name is 'The column that stores the name of the city or location provided by the openweather api.';
comment on column weather_loaction.location_country is 'The column that stores the country provided by the openweather api.';
comment on column weather_loaction.location_state is 'The column that stores the state provided by the openweather api (if in the us).';
comment on column weather_loaction.lat is 'The column that stores the latitude provided by the openweather api.';
comment on column weather_loaction.lon is 'The column that stores the longitude provided by the openweather api.';
--https://stackoverflow.com/a/8289253
create unique index name_country_state_constraint_idx on weather_location (location_name, location_country, location_state) where location_state is not null;
create unique index name_country_no_state_constraint_idx on weather_location (location_name, location_country) where location_state is null;


drop table if exists weather_user__weather_location;
create table weather_user__weather_location(
    id uuid primary key default uuid_generate_v4 () not null,
    created_at default current_timestamp not null,
    updated_at default current_timestamp,
    weather_user_id uuid not null references weather_user (id) on delete cascade,
    weather_location_id uuid not null references weather_location (id) on delete cascade,
    unique(weather_user_id, weather_location_id)
);
comment on table weather_user__weather_location is 'Table that stores the many-many relationship between users and locations. Each row is a unique combination of weather_user_id and weather_location_id.';
comment on column weather_user__weather_location.weather_user_id is 'The foreign key referencing the weather_user table.'
comment on column weather_user__weather_location.weather_location_id is 'The foreign key referencing the weather_location table.'
create index user_list_item_weather_user_id_idx on weather_user__weather_location (weather_user_id);
create index user_list_item_weather_location_id_idx on weather_user__weather_location (weather_location_id);

-- TODO get_weather_locations_for_weather_user
-- TODO get_id_for_weather_location_or_create_weather_location
-- TODO add_location_to_weather_user_list