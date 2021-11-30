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
        },
        {
          "id": 800,
          "main": "Clear",
          "description": "clear sky",
          "icon": "01d"
        },
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
    
    const weatherConditionSections = fakeData.weather.map( (wC) => 
        <section>
          <WeatherCondition weatherCondition={wC}></WeatherCondition>
        </section>
    );
    console.log(fakeData.weather)
    console.log(weatherConditionSections);
    return (
        <div className={"h-screen grid grid-cols-2 md:grid-cols-4 gap-3"}>

            <h3 className={"col-span-2 md:col-span-4 text-3xl tracking-widest underline font-extrabold font-serif"}>{fakeData.name}</h3>

            <section>
              <img 
              src="http://www.noaa.gov/sites/default/files/styles/landscape_width_1275/public/legacy/image/2019/Jun/PHOTO-dark%20and%20stormy%20cloudscape-istock-1125x534-Landscape.jpg?itok=xyVD1jOK"
              alt="weather"/>
            </section>

            <section className={"text-xl"}>
                <div className={"font-extrabold"}>Temp: {fakeData.main.temp}°</div>
                <div className={"font-extralight"}>Feels like {fakeData.main.feels_like}° and there's {fakeData.main.humidity}% humidity.</div>
                <div className={"md:flex"}>
                  <div>Low: {fakeData.main.temp_min}° </div>
                  <div></div>
                  <div>High: {fakeData.main.temp_max}°</div>
                </div>
            </section>

            <section className={"text-lg"}>
                <div>Sunrise: {fakeData.sys.sunrise}</div>
                <div>Sunset: {fakeData.sys.sunset}</div>
            </section>

            <section>
                <p>Wind Speed: {fakeData.wind.speed}</p>
                <p>{fakeData.clouds.all}% cloudy.</p>
            </section>

            {weatherConditionSections}
        </div>
    )
}
