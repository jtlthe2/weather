import { useState, useEffect, useRef } from 'react'
import './App.css'
import axios from 'axios';
import WeatherForCity from './WeatherForCity'
import Modal, {ModalHeader, ModalBody, ModalFooter} from './Modal'
import LoadingScreen from './LoadingScreen';

function App() {
  const [user, setUser] = useState();
  const [currentLocation, setCurrentLocation] = useState();
  const [citiesData, setCitiesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddLocationModal, setShowAddLocationModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userLogin, setUserLogin] = useState();
  const [locationList, setLocationList] = useState([]);
  const [locationSearch, setLocationSearch] = useState();
  const [locationSearchList, setLocationSearchList] = useState([]);

  const usernameRef = useRef(null);
  const searchLocationRef = useRef(null);

  const baseURL = process.env.NODE_ENV === 'production' ? "/api/v1" : "https://localhost:8020/api/v1"
  const axiosInstance = axios.create({
    baseURL
  })

  useEffect( () => {
    setLoading(true);
    const userInLocalStorage = localStorage.getItem("user");
    if(userInLocalStorage) {
      const userParsed = JSON.parse(userInLocalStorage);
      setUser(userParsed);
      axiosInstance.get(`locations?username=${userParsed.username}`)
      .then(res => {
        setLocationList(res.data);
      })
      .catch(err => {
        console.error("Error getting locations list: ", err);
      });
    }
    else {
      showLogin();
    }
  }, [])

  useEffect( () => {
    if(!user) {
      return;
    }

    // Current Location
    if("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        axiosInstance.get(`/weather-for-current-location?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=${user.weather_units}`)
        .then(res => {
          setCurrentLocation(res.data);
        })
        .catch(err => {
          console.error("Error getting current location data: ", err);
        })
      }, function(error) {
        console.log("rejected", error);
      });
    }
    else {
      console.log("location data not available in browser.");
    }

    // User's Location List
    axiosInstance.get(`/weather-for-locations?username=${user.username}&units=${user.weather_units}`)
    .then(res => {
      setCitiesData(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error getting city data: ", err);
    });
  }, [locationList, user]);

  function showLogin() {
    setShowLoginModal(true);
    usernameRef.current.focus();
  }
  function hideLogin() {
    setShowLoginModal(false);
  }

  function handleLoginOnChange(event) {
    setUserLogin(event.target.value);
  }

  function handleLoginSubmit(event) {
    event.preventDefault();
    if(userLogin.length > 0){
      login();
    }
  }

  function login() {
    axiosInstance.post(`/user?username=${userLogin}`)
      .then(response => {
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        hideLogin();
      })
      .catch(error => {
        console.log('Error logging in: ', error);
      });
  }

  function logout() {
    setUser(undefined);
    setUserLogin(undefined);
    setLocationList([]);
    setCitiesData([]);
    setCurrentLocation()
    localStorage.clear();
  }

  function locationSearchQuery() {
    let q = locationSearch.replace(", ", ",");
    q = q.replace(" ", "%20");
    axiosInstance.get(`/search-for-location?q=${q}`)
    .then(res => {
      setLocationSearchList(res.data);
    })
    .catch(err => {
      console.error("Error location search data: ", err);
    });
  }

  function handelLocationSearchChange(event) {
    setLocationSearch(event.target.value);
  }

  function handelLocationSearchSubmit(event) {
    event.preventDefault();
    if(locationSearch) {
      locationSearchQuery();
    }
  }

  function addLocationToList(location) {
    axiosInstance.post(`/add-location-to-list?username=${user.username}&name=${location.name}&country=${location.country}&lat=${location.lat}&lon=${location.lon}${location.state ? "&state=" + location.state : ""}`)
    .then(response => {   
      if(citiesData.length > 0) {
        setLocationList([...locationList, response.data]);
      }
      else { 
        setLocationList([response.data]);
      }   
      hideAddLocation();
    })
    .catch(err => {
      console.log('Error adding location to list: ', err)
    })
  }

  function removeLocationFromList(location) {
    console.log("removeLocationFromList", location)
    axiosInstance.delete(`/remove-location-from-list?username=${user.username}&loc_id=${location.name.id}`)
    .then(() => {
      setLocationList(locationList.filter((loc) => {return loc.id !== location.name.id}));
    })
    .catch(err => {
      console.log('Error removing location from list: ', err)
    })
  }

  function showAddLocation() {
    setShowAddLocationModal(true);
    searchLocationRef.current.focus();
  }

  function hideAddLocation() {
    setShowAddLocationModal(false);
  }

  // const fakeLocationsData = [{"name":"London","local_names":{"af":"Londen","ar":"لندن","ascii":"London","az":"London","bg":"Лондон","ca":"Londres","da":"London","de":"London","el":"Λονδίνο","en":"London","eu":"Londres","fa":"لندن","feature_name":"London","fi":"Lontoo","fr":"Londres","gl":"Londres","he":"לונדון","hi":"लंदन","hr":"London","hu":"London","id":"London","it":"Londra","ja":"ロンドン","la":"Londinium","lt":"Londonas","mk":"Лондон","nl":"Londen","no":"London","pl":"Londyn","pt":"Londres","ro":"Londra","ru":"Лондон","sk":"Londýn","sl":"London","sr":"Лондон","th":"ลอนดอน","tr":"Londra","vi":"Luân Đôn","zu":"ILondon"},"lat":51.5085,"lon":-0.1257,"country":"GB"},{"name":"London","local_names":{"ar":"لندن","ascii":"London","bg":"Лондон","de":"London","en":"London","fa":"لندن، انتاریو","feature_name":"London","fi":"London","fr":"London","he":"לונדון","ja":"ロンドン","lt":"Londonas","nl":"London","pl":"London","pt":"London","ru":"Лондон","sr":"Лондон"},"lat":42.9834,"lon":-81.233,"country":"CA"},{"name":"London","local_names":{"ar":"لندن","ascii":"London","en":"London","fa":"لندن، اوهایو","feature_name":"London","sr":"Ландон"},"lat":39.8865,"lon":-83.4483,"country":"US","state":"OH"},{"name":"London","local_names":{"ar":"لندن","ascii":"London","en":"London","fa":"لندن، کنتاکی","feature_name":"London","sr":"Ландон"},"lat":37.129,"lon":-84.0833,"country":"US","state":"KY"},{"name":"London","local_names":{"ascii":"London","ca":"Londres","en":"London","feature_name":"London"},"lat":36.4761,"lon":-119.4432,"country":"US","state":"CA"}]

  const menuClass = " align-items-center "

  const weatherForCurrentLocation = currentLocation 
  ? 
    <WeatherForCity key={currentLocation.name.id} cityData={currentLocation}></WeatherForCity> 
  :
    <div className={"h-1/4 justify-items-stretch border-8 rounded-md mx-8 my-5 transform transition-all duration-700 ease-in-out shadow-sm hover:shadow-2xl border-gray-600 hover:border-gray-700 bg-gray-600 hover:bg-gray-700"}>
    <section className={"p-10  text-white"}>
      <h3 className={"text-white text-2xl tracking-widest font-bold font-serif"}>Current Location Unavailable </h3>
    </section>
    </div>;

  const weatherForCities = !loading ? citiesData.map( cD =>
    <WeatherForCity key={cD.name.id} cityData={cD} onDelete={removeLocationFromList}></WeatherForCity>
  ) : null;

  const locationSearchResults = locationSearchList.map ( loc => 
    <div onClick={() => {addLocationToList(loc);}} className={"p-2 border-b-2 hover:bg-gray-50 tracking-wider font-bold font-serif"}>
      {loc.state ? `${loc.name}, ${loc.state}, ${loc.country}` : `${loc.name}, ${loc.country}`}
    </div>
  )

  return (
    <div>
      <Modal show={showLoginModal} onHide={hideLogin}>
        <ModalHeader>Login</ModalHeader>
        
        <ModalBody>
          <form onSubmit={handleLoginSubmit}>
            <label className={"font-bold text-lg"}>Username:  
              <input type="text" name="username" placeholder={"unique_username_2 (Press Enter to Submit)"} ref={usernameRef} onKeyUp={handleLoginOnChange} className={"shadow appearance-none border rounded w-1/2 py-2 px-3 mx-3 text-gray-700 leading-tight"}/>
            </label>
            <input type="submit" value="Login" className={"p-2 m-2 bg-blue-900 rounded-lg text-white font-bold text-xl text-center"}/>
          </form>
        </ModalBody>

      </Modal>
      <header className={"sticky top-0 z-50 p-1 mb-5 bg-blue-900 bg-opacity-90 shadow-2xl text-white text-xl"}>
        <ul className={"flex justify-evenly"}>
          <li>
            <p className={"tracking-widest cursor-pointer" + menuClass} onClick={() => user ? logout(): showLogin()}>{user ? "logout " + user.username : "login"}</p>
          </li>
          <li>
            <p className={"font-light tracking-widest" + menuClass}>weather app by jamie lewis</p>
          </li>
        </ul>
      </header>

      {loading ?
      <LoadingScreen></LoadingScreen>
      :
      <div disabled>
        <section className={"realtive flex flex-col mx-20"}>
          {weatherForCurrentLocation}
          {weatherForCities}
        </section>

        {
          user 
          ?
          <button className={"sticky bottom-16 left-16 z-30 h-20 w-20 bg-blue-900 transition-all transform duration-500 ease-in-out bg-opacity-90 hover:bg-opacity-100 hover:scale-150 active:scale-110 rounded-full font-extrabold shadow-lg hover:shadow-2xl text-white text-4xl text-center"} onClick={() => showAddLocation()}>+</button>
          :
          null
        }
        </div>
      }

      <Modal show={showAddLocationModal} onHide={hideAddLocation}>
        <ModalHeader>Add Location</ModalHeader>
        
        <ModalBody>
          <form onSubmit={handelLocationSearchSubmit}>
            <label className={"font-bold text-lg"}>Search: 
              <input type="text" name="location_search" placeholder={"Tokyo, JP (Location Name, Two Letter Country Code)"} ref={searchLocationRef} onKeyUp={handelLocationSearchChange} className={"shadow appearance-none border rounded w-1/2 py-2 px-3 mx-3 text-gray-700 leading-tight"}/>
            </label>
            <input type="submit" value="Submit" className={"p-2 m-2 bg-blue-900 rounded-lg text-white font-bold text-xl text-center"}/>
          </form>
          {locationSearchResults}
        </ModalBody>

        <ModalFooter>
          <button variant="secondary" onClick={hideAddLocation} className={"p-2 m-2 bg-gray-500 rounded-lg text-white font-bold text-xl text-center"}>Close</button>
        </ModalFooter>
      </Modal>

    </div>
  )
}

export default App
