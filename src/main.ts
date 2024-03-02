import citiesJson from './json_data/citiesJson.json';
import {
  initializeMap,
  addPinsToMap,
  dropPinClickCallback,
  mapSetViewCallback,
} from './map.ts';
import {
  addListButtonClickListener,
  addCloseButtonClickListener,
  addDropPinClickListener,
  populateCurrentWeather,
  populateHourlyWeather,
  showWeatherContainer,
  cityFunctionality,
  addHomeButtonClickListener,
  addCustomLocationButtonClickListener
} from './domManipulation.ts';
import { updateCitySubject$, weatherData$ } from './apiHelper.ts';
import { CityInterface } from './interfaces';
import './style.css';

const map = initializeMap();
const cities: CityInterface[] = citiesJson;
let customButtonOn = false;

addPinsToMap(map, cities, setWeather);
addPinsFunctionality(map);
addCustomPindropFunctionality(map);

addListButtonClickListener();
addCloseButtonClickListener();

addCustomLocationButtonClickListener(setWeather, setCustomLocationCallback);

const lat = localStorage.getItem("currentLat");
const lng = localStorage.getItem("currentLng");
if (lat !== null && lng!== null) {
  const city:CityInterface = {
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    cityName: 'Home',
  };
  addHomeButtonClickListener(city, setWeather);
}
// addHomeButtonClickListener(setWeather, mapSetViewCallback(map));

function addCustomPindropFunctionality(map: L.Map): void {
  addDropPinClickListener(() => {
    customButtonOn = !customButtonOn;
    dropPinClickCallback(map, customButtonOn, setWeather);
  });
}

weatherData$.subscribe((data) => {
  populateCurrentWeather(data.current, data.city);
  populateHourlyWeather(data.hourly, data.current);
  showWeatherContainer();
});

function setWeather(city: CityInterface) {
  updateCitySubject$.next(city);
  sessionStorage.setItem("currentLat", city.lat.toString());
  sessionStorage.setItem("currentLng", city.lng.toString());
}

function addPinsFunctionality(map: L.Map): void {
  cities.forEach((city) => {
    cityFunctionality(city, setWeather, mapSetViewCallback(map, city));
  });
}

function setCustomLocationCallback(): CityInterface {
  const lat = sessionStorage.getItem("currentLat");
  const lng = sessionStorage.getItem("currentLng");
  let city: CityInterface;
  if (lat !== null && lng!== null) {
    localStorage.setItem("HomeLat", lat);
    localStorage.setItem("HomeLng", lng);
    city =  {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      cityName: 'Home',
    } 
  } else {
      city = {
        lat: 0,
        lng: 0,
        cityName: 'Home',
      }
    }
    return city;
}


//
// button clicked?
// set cityFunctionality

// set the home button if there is anything in local storage
// set the home button if the set home button is clicked

// how to set the home button?