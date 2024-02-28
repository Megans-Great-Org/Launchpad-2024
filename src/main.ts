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
  toggleWeatherContainer,
  cityFunctionality,
} from './domManipulation.ts';
import { getWeatherObservable } from './apiHelper.ts';
import { CityInterface } from './interfaces';
import { Subscription } from 'rxjs';
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

let weatherSubscription$: Subscription | null = null;

async function setWeather(city: CityInterface): Promise<void> {
  try {
    if (weatherSubscription$) {
      weatherSubscription$.unsubscribe();
    }
    weatherSubscription$ = getWeatherObservable(city).subscribe({
      next: (data) => {
        populateCurrentWeather(data.current, city);
        populateHourlyWeather(data.hourly, data.current);
        toggleWeatherContainer();
      },
      error: (error) => {
        console.error('Fetch Error', error);
      },
    });
  } catch (error) {
    console.error(error);
  }
}

function addPinsFunctionality(map: L.Map): void {
  cities.forEach((city) => {
    cityFunctionality(city, setWeather, mapSetViewCallback(map, city));
  });
}
