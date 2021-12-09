import React from 'react'
import WeatherCondition from './WeatherCondition'

function getTimeString(timeEpochUTC, offset){
  const date = new Date(timeEpochUTC * 1000);
  const localeTime = date.toLocaleTimeString();
  const localTimeZoneOffset = date.getTimezoneOffset();
  console.log(localTimeZoneOffset, offset);
  if(offset === localTimeZoneOffset * -60) {
    return localeTime;
  }
  else {
    const timezone = date.toTimeString().split('(')[1].split(')')[0];
    const nonLocaleTime = new Date(timeEpochUTC * 1000 + offset * 1000 + localTimeZoneOffset * 60000).toLocaleTimeString();
    return `${nonLocaleTime} (or ${localeTime} ${timezone})`
  }
}

export default function WeatherForCity(props) {
  const nameData = props.cityData.name;
  const weatherData = props.cityData.weather.current;

  let locationName = nameData.location_name;
  if(nameData.location_state) {locationName += `, ${nameData.location_state}`;}
  if(nameData.location_country) {locationName += `, ${nameData.location_country}`;}

  function deleteLocationWithConfrim() {
    console.log('deleteLocationWithConfrim');
    const didConfrim = confirm(`You wanna remove ${locationName} from your list?`);
    if(didConfrim) {
      props.onDelete(props.cityData);
    }
  }

    return (
        <div className={"h-1/2 grid grid-cols-2 md:grid-cols-4 justify-items-stretch border-8 rounded-md mx-0 md:mx-8 my-5 transform transition-all duration-700 ease-in-out shadow-sm hover:shadow-2xl border-gray-600 hover:border-gray-700 bg-gray-600 hover:bg-gray-700"}>
          {
            nameData.id !== 'current_location'
            ?
            <button 
            className={"absolute top-2 right-5 p-2 w-11 h-11 rounded-full bg-red-600 shadow-inner drop-shadow-2xl text-white text-lg text-center font-thin font-mono transform transition-all duration-100 ease-in-out active:scale-95"}
              onClick={() => deleteLocationWithConfrim()}
            >rm</button>
            :
            null
          }

          <section className={"col-span-full  p-10  text-white"}>
            <h3 className={"text-white text-2xl tracking-widest font-bold font-serif"}>{locationName} <span className={"font-extrabold font-mono tracking-tighter text-3xl"}>{weatherData.temp}°</span></h3>
            <div className={"font-extralight"}>Feels like {weatherData.feels_like}°.</div>
          </section>

            <section className={"bg-white p-2"}>
              <img 
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
              alt={weatherData.weather[0].description}/>
            </section>

            <section className={"text-xl bg-white p-2"}>
                <div className={"font-extrabold"}>Temp: {weatherData.temp}°</div>
                <div className={"font-extralight"}>Feels like {weatherData.feels_like}° and there's {weatherData.humidity}% humidity.</div>
                <div className={"md:flex"}>
                <WeatherCondition weatherCondition={weatherData.weather[0]}></WeatherCondition>
                  {/* <div>Low: {fakeData.main.temp_min}° </div>
                  <div></div>
                  <div>High: {fakeData.main.temp_max}°</div> */}
                </div>
            </section>

            <section className={"text-lg bg-white p-2"}>
              {/* TODO make these look better */}
                <div>Sunrise: {getTimeString(weatherData.sunrise, props.cityData.weather.timezone_offset)}</div>
                <div>Sunset: {getTimeString(weatherData.sunset, props.cityData.weather.timezone_offset)}</div>
            </section>

            <section className={"bg-white p-2"}>
                <p>Wind Speed: {weatherData.wind_speed} mph</p>
                <p>{weatherData.clouds}% cloudy.</p>
            </section>
        </div>
    )
}
