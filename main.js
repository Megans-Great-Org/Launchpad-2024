import './style.css';
import getWeatherData from './apiHelper.js';

import cities from './cities.json';
const map = L.map('map').setView([-30.5595, 22.9375], 5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap',
}).addTo(map);

cities.forEach((city) => {
  const marker = L.marker([city.lat, city.lng], {
    riseOnHover: true,
    title: city.city_name,
    autoPanFocus: true,
  }).addTo(map);
  marker.options.riseOnHover = true;

  const cityList = document.getElementById('city-list');
  const a = document.createElement('a');
  a.href = '#'; //remember to set href
  a.innerText = city.city_name;

  a.addEventListener('click', function (event) {
    toggleNav();
    event.preventDefault();
    map.setView([city.lat, city.lng], map.getZoom());
    getWeatherData(city);
  });

  cityList.appendChild(a);

  marker.on('click', function () {
    const { lat, lng } = marker.getLatLng();
    map.setView([lat, lng], map.getZoom());
    getWeatherData(city);
  });
});

let redIcon = L.icon({
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
let mapContainer = document.querySelector('.leaflet-container');
document.getElementById('drop-pin').addEventListener('click', function () {
  tempMarker.remove();
  on = !on;
  if (on) {
    document.getElementById('drop-pin').classList.add('clicked-button');
    mapContainer.classList.add('hand-pointer');
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
    document.getElementById('drop-pin').classList.remove('clicked-button');
    mapContainer.classList.remove('hand-pointer');
    map.on('click', function () {
      tempMarker.remove();
    });
  }
});

function toggleNav() {
  var sidepanel = document.getElementById('city-list');
  if (sidepanel.style.width === '250px') {
    sidepanel.style.width = '0';
  } else {
    sidepanel.style.width = '250px';
  }
}
document
  .getElementById('city-list-button')
  .addEventListener('click', toggleNav);
document.getElementById('closebtn').addEventListener('click', toggleNav);
