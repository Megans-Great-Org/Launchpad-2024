import citiesJson from './json_data/citiesJson.json';
import { initializeMap, addPinsToMap, dropPinClickCallback, mapSetViewCallback } from './map.ts';
import { addListButtonClickListener, addCloseButtonClickListener, addDropPinClickListener, populateCurrentWeather, populateHourlyWeather, showWeatherContainer, cityFunctionality } from './domManipulation.ts';
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

function addCustomPindropFunctionality(map: L.Map): void {
  addDropPinClickListener(() => {
    customButtonOn = !customButtonOn;
    dropPinClickCallback(map, customButtonOn, setWeather);
  });
} 

weatherData$.subscribe((data)=> {
  populateCurrentWeather(data.current, data.cityName);
  populateHourlyWeather(data.hourly, data.current);
  showWeatherContainer();
})

function setWeather(city: CityInterface) {
  updateCitySubject$.next(city);
}

function addPinsFunctionality(map: L.Map): void {
  cities.forEach((city) => {
      cityFunctionality(city, setWeather, mapSetViewCallback(map, city));
  });
}