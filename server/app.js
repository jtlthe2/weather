const PORT = 8020;
const https = require('https');
const express = require('express');
const cors = require('cors');
const pgp = require('pg-promise')();
const axios = require('axios');
const fs = require('fs');

require('dotenv').config();


const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT;
const DB_HOST = process.env.DB_HOST;
const KEY = fs.readFileSync('./key.pem');
const CERT = fs.readFileSync('./cert.pem');


const app = express();
const db = pgp(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);

app.use(cors({
    origin: 'https://localhost:3000'
}));

const server = https.createServer({key: KEY, cert: CERT }, app);

app.get('/', (req, res) => {
    console.log(req);
    res.json('seltzer');
});

// TODO patch user

// TODO delete user

// TODO patch location list for user

// TODO helper get location list for user
// TODO helper add location

app.get('/search-for-location', (req, res) => {
    const query = req.query.q;
    axios(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=10&appid=${OPEN_WEATHER_API_KEY}`).then(response => {
        console.log('geo response', response);
        res.json(response.data);
    }).catch( error => {
        console.error('Error getting geo data: ', error);
    });
});

// TODO weather for location (to query weather data for current location)
app.get('/weather-for-current-location', (req, res) => {
  // TODO get users weather units.
  // const username = req.query.username;
  const units = 'imperial';
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
    const units = 'imperial';
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

server.listen(PORT, () => { console.log('listening on ', PORT) });