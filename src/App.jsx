import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import WeatherForCity from './WeatherForCity'

function App() {

  const menuClass = " align-middle hover:underline "

  return (
    <div>
      <header className={"sticky top-0 z-50 p-1 mb-2 bg-blue-900 bg-opacity-90 shadow-2xl text-white text-xl"}>
        <ul className={"flex justify-evenly"}>
          <li>
            <a href="#" className={"tracking-widest" + menuClass}>username</a>
          </li>
          <li>
            <a href="#" className={"font-light tracking-widest" + menuClass}>jamie weather</a>
          </li>
          <li>
            <a href="#" className={"align-middle" + menuClass}>☰</a> 
          </li>
        </ul>
      </header>

      <section className={"realtive flex flex-col m-20"}>
        <WeatherForCity></WeatherForCity>
        <WeatherForCity></WeatherForCity>
        <WeatherForCity></WeatherForCity>
      </section>

      <button className={"sticky bottom-5 left-5 z-50 px-2 py-1 bg-blue-900 bg-opacity-90 hover:bg-opacity-100 font-extrabold rounded-lg shadow-xl text-white text-3xl"}>+</button>

    </div>
  )
}

export default App
