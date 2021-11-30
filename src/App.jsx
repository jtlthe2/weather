import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import WeatherForCity from './WeatherForCity'

function App() {

  return (
    <div>
      <header className={"flex justify-center"}>
        <h1>jamie weather</h1>
        <p>username</p>
        <p>hamburger menu</p>
      </header>
      <WeatherForCity></WeatherForCity>
      <WeatherForCity></WeatherForCity>
      <WeatherForCity></WeatherForCity>
    </div>
  )
}

export default App
