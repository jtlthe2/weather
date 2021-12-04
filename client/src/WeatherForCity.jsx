import React from 'react'
import WeatherCondition from './WeatherCondition'

export default function WeatherForCity(props) {

    const fakeData = props.cityData.current;
    
    const weatherConditionSections = fakeData.weather.map( (wC) => 
        <section>
          <WeatherCondition weatherCondition={wC}></WeatherCondition>
        </section>
    );



    return (
        <div className={"h-screen grid grid-cols-2 md:grid-cols-4 gap-3 justify-items-stretch"}>

            <h3 className={"col-span-full  p-10 bg-black text-white text-3xl tracking-widest font-extrabold font-serif"}>Current Location</h3>
            {/* <svg width={"100%"} viewBox={"0 0 170 20"} className={"col-span-full"}>
              <rect width="170" height="20"></rect>
              <text x="2" y="15" fill={"#ffffff"} className={"tracking-widest font-extrabold font-serif"}>{fakeData.name} aaaa</text>
            </svg> */}

            <section>
              <img 
              src="https://www.noaa.gov/sites/default/files/styles/landscape_width_1275/public/legacy/image/2019/Jun/PHOTO-dark%20and%20stormy%20cloudscape-istock-1125x534-Landscape.jpg?itok=xyVD1jOK"
              alt="weather"/>
            </section>

            <section className={"text-xl"}>
                <div className={"font-extrabold"}>Temp: {fakeData.temp}°</div>
                <div className={"font-extralight"}>Feels like {fakeData.feels_like}° and there's {fakeData.humidity}% humidity.</div>
                <div className={"md:flex"}>
                  {/* <div>Low: {fakeData.main.temp_min}° </div>
                  <div></div>
                  <div>High: {fakeData.main.temp_max}°</div> */}
                </div>
            </section>

            <section className={"text-lg"}>
                <div>Sunrise: {fakeData.sunrise}</div>
                <div>Sunset: {fakeData.sunset}</div>
            </section>

            <section>
                <p>Wind Speed: {fakeData.wind_speed}</p>
                <p>{fakeData.clouds}% cloudy.</p>
            </section>

            {weatherConditionSections}
        </div>
    )
}
