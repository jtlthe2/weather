import React from 'react'
import WeatherCondition from './WeatherCondition'

function convertUTCEpochToSpecificTimezone(timeEpochUTC, tzOffset){
  var d = new Date(timeEpochUTC * 1000);
  return nd.toLocaleString();
}

export default function WeatherForCity(props) {
  console.log(props);
  const nameData = props.cityData.name;
  const weatherData = props.cityData.weather.current;

  let locationName = nameData.location_name;
  if(nameData.location_state) {locationName += `, ${nameData.location_state}`;}
  if(nameData.location_country) {locationName += `, ${nameData.location_country}`;}
  
  const weatherConditionSections = weatherData.weather.map( (wC) => 
      <section className={"bg-white col-span-full"}>
        <WeatherCondition weatherCondition={wC}></WeatherCondition>
      </section>
  );

    return (
        <div className={"h-1/2 grid grid-cols-2 md:grid-cols-4 justify-items-stretch border-8  rounded-md mx-8 my-5 transition-all duration-700 ease-in-out shadow-sm hover:shadow-2xl border-gray-600 hover:border-gray-700 bg-gray-600 hover:bg-gray-700"}>

          <section className={"col-span-full  p-10  text-white"}>
            <h3 className={"text-white text-2xl tracking-widest font-bold font-serif"}>{locationName} <span className={"font-extrabold font-mono tracking-tighter text-3xl"}>{weatherData.temp}°</span></h3>
                <div className={"font-extralight"}>Feels like {weatherData.feels_like}°.</div>
          </section>

            <section className={"bg-white"}>
              {/* <img 
              src="https://www.noaa.gov/sites/default/files/styles/landscape_width_1275/public/legacy/image/2019/Jun/PHOTO-dark%20and%20stormy%20cloudscape-istock-1125x534-Landscape.jpg?itok=xyVD1jOK"
              alt="weather"/> */}
            </section>

            <section className={"text-xl bg-white"}>
                <div className={"font-extrabold"}>Temp: {weatherData.temp}°</div>
                <div className={"font-extralight"}>Feels like {weatherData.feels_like}° and there's {weatherData.humidity}% humidity.</div>
                <div className={"md:flex"}>
                  {/* <div>Low: {fakeData.main.temp_min}° </div>
                  <div></div>
                  <div>High: {fakeData.main.temp_max}°</div> */}
                </div>
            </section>

            <section className={"text-lg bg-white"}>
              {/* TODO make these look better */}
                <div>Sunrise: {new Date(weatherData.sunrise * 1000).toTimeString()}</div>
                <div>Sunset: {new Date(weatherData.sunset * 1000).toTimeString()}</div>
            </section>

            <section className={"bg-white"}>
                <p>Wind Speed: {weatherData.wind_speed} mph</p>
                <p>{weatherData.clouds}% cloudy.</p>
            </section>

            {weatherConditionSections}
        </div>
    )
}
