const https = require('https');
const express = require('express');
const cors = require('cors');
const pgp = require('pg-promise')();
const axios = require('axios');
const fs = require('fs');

require('dotenv').config();

const SERVER_PORT = process.env.SERVER_PORT;
const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT;
const DB_HOST = process.env.DB_HOST;
const REACT_APP_URL = process.env.REACT_APP_URL;
const KEY = fs.readFileSync('./key.pem');
const CERT = fs.readFileSync('./cert.pem');


const app = express();
const db = pgp(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);

app.use(cors({
    origin: REACT_APP_URL
}));

const server = https.createServer({key: KEY, cert: CERT }, app);

app.get('/', (req, res) => {
    res.json('ˁ˚ᴥ˚ˀ');
});

app.post('/user', (req, res) => {
  const username = req.query.username;
  db.func('get_weather_user_or_create_weather_user', [username])
  .then(data =>{
    res.json(data[0]);
  })
  .catch(error => {
    console.error('Error getting user: ', error);
  })
});

app.post('/add-location-to-list', (req, res) => {
  const username = req.query.username;
  const loc_name = req.query.name;
  const loc_country = req.query.country;
  const lat = req.query.lat;
  const lon = req.query.lon;
  const loc_state = req.query.state;
  console.log(loc_state);
  db.func('add_location_to_weather_user_list', [username, loc_name, loc_country, lat, lon, loc_state])
  .then(data =>{
    res.json(data[0]);
  })
  .catch(error => {
    console.error('Error updating list: ', error);
  })
});

app.delete('/remove-location-from-list', (req, res) => {
  const username = req.query.username;
  const loc_id = req.query.loc_id;
  db.func('remove_location_from_weather_user_list', [username, loc_id])
  .then(data =>{
    res.send('Deleted.')
  })
  .catch(error => {
    console.error('Error removing location: ', error);
  })
});

app.get('/search-for-location', (req, res) => {
    const query = req.query.q;
    axios(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=20&appid=${OPEN_WEATHER_API_KEY}`).then(response => {
        console.log('geo response', response);
        res.json(response.data);
    }).catch( error => {
        console.error('Error getting geo data: ', error);
    });
});

app.get('/weather-for-current-location', (req, res) => {
  const units = req.query.units;
  console.log(req.query);
  axios(`https://api.openweathermap.org/data/2.5/onecall?units=${units}&lat=${req.query.lat}&lon=${req.query.lon}&exclude=hourly,minutely,daily&appid=${OPEN_WEATHER_API_KEY}`).then( response => {
    const currentLocationData = {
      name: {
        id: 'current_location',
        lat: req.query.lat,
        location_name: "Current Location",
        lon: req.query.lon,
        weather_units: units
      }, 
      weather: response.data
    }
    res.json(currentLocationData);
    }).catch( error => {
      console.error('Error getting current location data: ', error);
    })
})

app.get('/weather-for-locations', (req, res) => {
    const username = req.query.username;
    const units = req.query.units;
    let citiesData = [];
    db.func('get_weather_locations_for_weather_user', [username])
      .then(locationList => {
        let promises = [];
        locationList.forEach(loc => {
          promises.push(
            axios(`https://api.openweathermap.org/data/2.5/onecall?units=${units}&lat=${loc.lat}&lon=${loc.lon}&exclude=hourly,minutely,daily&appid=${OPEN_WEATHER_API_KEY}`).then( response => {
              if(citiesData.length > 0) { citiesData = [...citiesData, {name: loc, weather: response.data}]; }
              else { citiesData = [{name: loc, weather: response.data}]; }
            }).catch( error => {
              console.error('Error getting city data: ', error);
            })
          );
        });
        Promise.all(promises).then(() => {console.log('done!'); res.json(citiesData);});
      })
      .catch(error => {
        console.error('locationList db query', error);
      });
});

app.get('/locations', (req, res) => {
  const username = req.query.username;
  db.func('get_weather_locations_for_weather_user', [username])
    .then(locationList => {
      res.json(locationList);
    })
    .catch(error => {
      console.error('locationList db query', error);
    });
});

server.listen(SERVER_PORT, () => { console.log('listening on ', SERVER_PORT) });