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

server.listen(PORT, () => { console.log('listening on ', PORT) });