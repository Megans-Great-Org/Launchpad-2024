import 'leaflet/dist/leaflet.css';
import citiesJson from './json_data/citiesJson.json';
import { initializeMap, addPinsToMap, addCustomPindropFunctionality } from './map.ts';
import { addListButtonClickListener, addCloseButtonClickListener } from './domManipulation.ts';
import { CityInterface } from './interfaces';
import './style.css';

const map = initializeMap();
const cities: CityInterface[] = citiesJson;
addPinsToMap(map, cities);
addCustomPindropFunctionality(map);

addListButtonClickListener();
addCloseButtonClickListener();