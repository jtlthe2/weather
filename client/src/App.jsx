import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios';
import WeatherForCity from './WeatherForCity'
import Modal, {ModalHeader, ModalBody, ModalFooter} from './Modal'

function App() {
  const [citiesData, setCitiesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [show, setShow] = useState(false);

  const [locationList, setLocationList] = useState([]);
  const [units, setUnits] = useState("imperial")

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
      navigator.geolocation.getCurrentPosition(function(position) {
        console.log("Latitude is :", position.coords.latitude);
        console.log("Longitude is :", position.coords.longitude);
        addLocationToList({lon: position.coords.longitude, lat: position.coords.latitude});
      }, function(error) {
        console.log("rejected", error);
        showAddLocation();
      });
    }
    else {
      console.log("no avail");
      showAddLocation();
    }

    console.log("trying");
    axios("https://172.31.249.65:8020/weather").then(res => {
      console.log("cool", res);
    }).catch(err => {
      console.log("uncool", err)
    })
  }, [])

  useEffect( () => {
    let promises = [];
    locationList.forEach(loc => {
      promises.push(
        axios("https://api.openweathermap.org/data/2.5/onecall?units=" + units + "&lat=" + loc.lat + "&lon=" + loc.lon + "&exclude=hourly,minutely,daily&appid=APIKEYJAMIE").then( res => {
          console.log("response", res);
          if(citiesData.length > 0) {setCitiesData([...citiesData, res.data]);}
          else { 
          setCitiesData([res.data]);}
          
        }).catch( err => {
          console.error("Error getting city data: ", err);
        })
      );
    });
    Promise.all(promises).then(() => {console.log("done!"); setLoading(false)});
  }, [locationList, units]);

  const menuClass = " align-middle hover:underline "

  console.log("Loading ", loading, citiesData);

  const weatherForCity = !loading ? citiesData.map( cD =>
    <WeatherForCity cityData={cD}></WeatherForCity>
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
        {weatherForCity}
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
