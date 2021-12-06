const PORT = 8020;
const https = require('https');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

require('dotenv').config();


const weatherApiKey = process.env.OPEN_WEATHER_API_KEY;
const key = fs.readFileSync('./key.pem');
const cert = fs.readFileSync('./cert.pem');
// const citiesJsonFile = fs.readFile('./city.list.json');


const app = express();

app.use(cors({
    origin: 'https://localhost:3000'
}));

const server = https.createServer({key: key, cert: cert }, app);

app.get('/', (req, res) => {
    console.log(req);
    res.json('seltzer');
});

// TODO post user

// TODO patch user

// TODO delete user

// TODO patch location list for user

// TODO helper get location list for user
// TODO helper add location

app.get('/search-for-location', (req, res) => {
    const query = req.query.q;
    axios("https://api.openweathermap.org/geo/1.0/direct?q=" + query + "&limit=10&appid=" + weatherApiKey).then(response => {
        console.log("geo response", response);
        res.json(response.data);
    }).catch( error => {
        console.error("Error getting city data: ", error);
    });
});

// TODO weather for location (to query weather data for current location)

app.get('/weather-for-locations', (req, res) => {
    // const userId = req.query.userId;
    // TODO Get users location list
    // TODO Get users units
    // TODO incorporate name into this.
    const locationList = [{lon: "-94.04", lat: "33.44"}, {lon: "-94.04", lat: "33.44"}, {lon: "-94.04", lat: "33.44"}];
    const units = "imperial";
    let promises = [];
    let citiesData = [];
    locationList.forEach(loc => {
      promises.push(
        axios("https://api.openweathermap.org/data/2.5/onecall?units=" + units + "&lat=" + loc.lat + "&lon=" + loc.lon + "&exclude=hourly,minutely,daily&appid=" + weatherApiKey).then( response => {
          console.log("weather response", response);
          if(citiesData.length > 0) { citiesData = [...citiesData, response.data]; }
          else { citiesData = [response.data]; }
          
        }).catch( error => {
          console.error("Error getting city data: ", error);
        })
      );
    });
    Promise.all(promises).then(() => {console.log("done!"); res.json(citiesData);});
});

server.listen(PORT, () => { console.log('listening on ', PORT) });