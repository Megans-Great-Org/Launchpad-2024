import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import getWeatherData from './apiHelper.ts';
import { CityInterface } from './interfaces';
import { toggleNav } from './domManipulation.ts';

export function initializeMap(): L.Map {
    const map = L.map('map').setView([-30.5595, 22.9375], 5); //set view to South Africa

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap',
    }).addTo(map);

    return map;
}

export function addPinsToMap(map: L.Map, cities: CityInterface[]): void {
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
}

export function addCustomPindropFunctionality (map: L.Map): void {
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
      const dropPin = document.getElementById('drop-pin');
      if (dropPin) dropPin.addEventListener('click', function () {
        tempMarker.remove();
        on = !on;
        if (on) {
          if(dropPin) dropPin.classList.add('clicked-button');
          if (mapContainer) mapContainer.classList.add('hand-pointer');
          map.on('click', function (event) {
            tempMarker.remove();
            tempMarker = L.marker(event.latlng, { icon: redIcon }).addTo(map);
            const city = {
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
}