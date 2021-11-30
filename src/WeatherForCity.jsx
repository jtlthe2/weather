import React from 'react'
import WeatherCondition from './WeatherCondition'

export default function WeatherForCity() {
    const fakeData = {
      "coord": {
        "lon": -122.08,
        "lat": 37.39
      },
      "weather": [
        {
          "id": 800,
          "main": "Clear",
          "description": "clear sky",
          "icon": "01d"
        }
      ],
      "base": "stations",
      "main": {
        "temp": 282.55,
        "feels_like": 281.86,
        "temp_min": 280.37,
        "temp_max": 284.26,
        "pressure": 1023,
        "humidity": 100
      },
      "visibility": 16093,
      "wind": {
        "speed": 1.5,
        "deg": 350
      },
      "clouds": {
        "all": 1
      },
      "dt": 1560350645,
      "sys": {
        "type": 1,
        "id": 5122,
        "message": 0.0139,
        "country": "US",
        "sunrise": 1560343627,
        "sunset": 1560396563
      },
      "timezone": -25200,
      "id": 420006353,
      "name": "Mountain View",
      "cod": 200
    }   
    
    const weatherConditions = fakeData.weather.map( (wC) => 
        <li><WeatherCondition weatherCondition={wC}></WeatherCondition></li>
    );
    console.log(fakeData.weather)
    console.log(weatherConditions);
    return (
        <div className={"center"}>
            <h3 className={"p-3 text-xl font-extrabold font-serif"}>{fakeData.name}</h3>

            <section>
                <div className={"font-extrabold"}>Temp: {fakeData.main.temp}°</div>
                <div className={"font-extralight"}>Feels like {fakeData.main.feels_like}° and there's {fakeData.main.humidity}% humidity.</div>
                <div>Low: {fakeData.main.temp_min}°</div>
                <div>High: {fakeData.main.temp_max}°</div>
            </section>

            <section>
                <div>Sunrise: {fakeData.sys.sunrise}</div>
                <div>Sunset: {fakeData.sys.sunset}</div>
            </section>

            <section>
                <ul>
                    {weatherConditions}
                </ul>
                <p>Wind Speed: {fakeData.wind.speed}</p>
                <p>{fakeData.clouds.all}% cloudy.</p>
            </section>
        </div>
    )
}
