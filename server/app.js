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


const app = express();

app.use(cors({
    origin: 'https://localhost:3000'
}));

const server = https.createServer({key: key, cert: cert }, app);

app.get('/', (req, res) => {
    console.log(req);
    res.json('seltzer waters');
});

app.get('/weather', (req, res) => {
    console.log(req);
    res.json('seltzer weathers');
})

app.get('/weather-for-locations', (req, res) => {
    const locationList = [{lon: "-94.04", lat: "33.44"}, {lon: "-94.04", lat: "33.44"}, {lon: "-94.04", lat: "33.44"}];
    const units = "imperial";
    let promises = [];
    let citiesData = [];
    locationList.forEach(loc => {
      promises.push(
        axios("https://api.openweathermap.org/data/2.5/onecall?units=" + units + "&lat=" + loc.lat + "&lon=" + loc.lon + "&exclude=hourly,minutely,daily&appid=" + weatherApiKey).then( weatherRes => {
          console.log("response", weatherRes);
          if(citiesData.length > 0) { citiesData = [...citiesData, weatherRes.data];}
          else { citiesData = [weatherRes.data];}
          
        }).catch( weatherError => {
          console.error("Error getting city data: ", weatherError);
        })
      );
    });
    Promise.all(promises).then(() => {console.log("done!"); res.json(citiesData);});
})

server.listen(PORT, () => { console.log('listening on ', PORT) });