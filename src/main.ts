import citiesJson from './json_data/citiesJson.json';
import { initializeMap, addPinsToMap, dropPinClickCallback, mapSetViewCallback } from './map.ts';
import { addListButtonClickListener, addCloseButtonClickListener, addDropPinClickListener, populateCurrentWeather, populateHourlyWeather, toggleWeatherContainer, cityFunctionality } from './domManipulation.ts';
import getWeatherData from './apiHelper.ts';
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

async function setWeather(city: CityInterface): Promise<void> {
  toggleWeatherContainer();
  try {
      const [currentWeatherData, hourlyWeatherData] = await getWeatherData(city);
      populateCurrentWeather(currentWeatherData, city);
      populateHourlyWeather(hourlyWeatherData, currentWeatherData);
      toggleWeatherContainer();
  } catch (error) {
      throw error;
  }
}

function addPinsFunctionality(map: L.Map): void {
  cities.forEach((city) => {
      cityFunctionality(city, setWeather, mapSetViewCallback(map, city));
  });
}