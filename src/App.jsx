import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import WeatherForCity from './WeatherForCity'

function App() {

  return (
    <div>
      <header className={"flex justify-center"}>
        <h1 className={"font-light text-xl tracking-widest align-middle"}>jamie weather</h1>
        <p className={"text-xl tracking-widest align-middle"}>username</p>
        <p className={"align-middle"}>hamburger menu</p>
      </header>

      <section>
        <WeatherForCity></WeatherForCity>
        <WeatherForCity></WeatherForCity>
        <WeatherForCity></WeatherForCity>
        <button>Add City</button>
      </section>

    </div>
  )
}

export default App
