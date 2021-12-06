import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios';
import WeatherForCity from './WeatherForCity'
import Modal, {ModalHeader, ModalBody, ModalFooter} from './Modal'

function App() {
  const [currentLocation, setCurrentLocation] = useState();
  const [citiesData, setCitiesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [show, setShow] = useState(false);

  const [locationList, setLocationList] = useState([]);

  function addLocationToList(location) {
    if(citiesData.length > 0) {
      setLocationList([...locationList, location]);
    }
    else { 
      setLocationList([location]);
    }
    hideAddLocation();
  }

  function showAddLocation() {
    // alert("Add a location");
    // addLocationToList({lon: "-94.04", lat: "33.44"});
    setShow(true);
  }

  function hideAddLocation() {
    setShow(false);
  }

  useEffect( () => {
    if("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        axios(`https://localhost:8020/weather-for-current-location?username=jtlthe2&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
        .then(res => {
          console.log("response", res.data);
          setCurrentLocation(res.data);
        })
        .catch(err => {
          console.error("Error getting current location data: ", err);
        })
      }, function(error) {
        console.log("rejected", error);
        showAddLocation();
      });
    }
    else {
      console.log("no avail");
      showAddLocation();
    }
  }, [])

  useEffect( () => {
    axios("https://localhost:8020/weather-for-locations?username=jtlthe2")
    .then(res => {
      console.log("response", res.data);
      setCitiesData(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error getting city data: ", err);
    })
  }, [locationList]);

  const menuClass = " align-middle hover:underline "

  console.log("Loading ", loading, citiesData);

  const weatherForCurrentLocation = currentLocation ? <WeatherForCity key={currentLocation.name.id} cityData={currentLocation}></WeatherForCity> : null;

  const weatherForCities = !loading ? citiesData.map( cD =>
    <WeatherForCity key={cD.name.id} cityData={cD}></WeatherForCity>
  ) : null;

  if(loading) return <div>loading</div>

  return (
    <div>
      <header className={"sticky top-0 z-50 p-1 mb-2 bg-blue-900 bg-opacity-90 shadow-2xl text-white text-xl"}>
        <ul className={"flex justify-evenly"}>
          <li>
            <a href="#" className={"tracking-widest" + menuClass}>👤 username</a>
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
        {weatherForCurrentLocation}
        {weatherForCities}
      </section>

      <button className={"sticky bottom-5 left-5 z-30 h-20 w-20 bg-blue-900 transition-all transform duration-500 ease-in-out bg-opacity-90 hover:bg-opacity-100 hover:scale-125 rounded-full font-extrabold shadow-xl text-white text-4xl text-center"} onClick={() => showAddLocation()}>+</button>

      <Modal show={show} onHide={hideAddLocation}>
        <ModalHeader>Add Location</ModalHeader>
        
        <ModalBody>
          <select>
            <option>Cool</option>
            <option>Neat</option>
          </select>
        </ModalBody>

        <ModalFooter>
          <button variant="secondary" onClick={hideAddLocation} className={"p-5 m-2 bg-gray-500 rounded-lg text-white font-bold text-2xl text-center"}>Close</button>
          <button variant="primary" onClick={addLocationToList} className={"p-5 m-2 bg-blue-900 rounded-lg text-white font-bold text-2xl text-center"}>Add</button>
        </ModalFooter>
      </Modal>

    </div>
  )
}

export default App
