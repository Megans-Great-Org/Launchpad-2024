import './style.css';
import getWeatherData from './apiHelper.ts';
import citiesJson from './json_data/citiesJson.json';
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import { CityInterface } from './interfaces';
//remember to order the imports
const map = L.map('map').setView([-30.5595, 22.9375], 5); //set view to South Africa

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap',
}).addTo(map);

const cities: CityInterface[] = citiesJson;

cities.forEach((city) => {
  const marker = L.marker([city.lat, city.lng], {
    riseOnHover: true,
    title: city.city_name,
    autoPanOnFocus: true,
  }).addTo(map);
  marker.options.riseOnHover = true;

  const cityList = document.getElementById('city-list');
  const a = document.createElement('a');
  a.innerText = city.city_name;

  a.addEventListener('click', function (event) {
    toggleNav();
    event.preventDefault();
    map.setView([city.lat, city.lng], map.getZoom());
    getWeatherData(city);
  });

  (cityList) ? cityList.appendChild(a) : null;

  marker.on('click', function () {
    const { lat, lng } = marker.getLatLng();
    map.setView([lat, lng], map.getZoom());
    getWeatherData(city);
  });
});

const redIcon = L.icon({
  iconUrl: 'public/red-pin.png',

  iconSize: [25, 39],
  shadowSize: [50, 64],
  iconAnchor: [12, 39],
  shadowAnchor: [4, 62],
  popupAnchor: [-3, -76],
  className: 'hand-pointer',
});

let tempMarker = L.marker([0, 0], { icon: redIcon });
let on = false;
const mapContainer = document.querySelector('.leaflet-container');
let dropPin = document.getElementById('drop-pin');
if (dropPin) dropPin.addEventListener('click', function () {
  tempMarker.remove();
  on = !on;
  if (on) {
    if(dropPin) dropPin.classList.add('clicked-button');
    if (mapContainer) mapContainer.classList.add('hand-pointer');
    map.on('click', function (event) {
      tempMarker.remove();
      tempMarker = L.marker(event.latlng, { icon: redIcon }).addTo(map);
      let city = {
        lat: event.latlng.lat,
        lng: event.latlng.lng,
        city_name: 'New Location',
      };
      getWeatherData(city);
    });
  } else {
    if (dropPin) dropPin.classList.remove('clicked-button');
    if (mapContainer) mapContainer.classList.remove('hand-pointer');
    map.on('click', function () {
      tempMarker.remove();
    });
  }
});

function toggleNav() {
  const sidepanel = document.getElementById('city-list');
  if (sidepanel) {
    if (sidepanel.style.width === '250px') {
      sidepanel.style.width = '0';
    } else {
      sidepanel.style.width = '250px';
    }
  }
}

const listButton = document.getElementById('city-list-button');
if (listButton) listButton.addEventListener('click', toggleNav);
const closeButton = document.getElementById('close-button');
if (closeButton) closeButton.addEventListener('click', toggleNav);
