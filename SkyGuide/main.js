import './style.css';
import weatherData from './weatherData.json';
import weatherDesign from './weatherDesign.json';
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
    event.preventDefault();
    //close the nav
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
  iconUrl: 'assets/red-pin.png',

  iconSize: [25, 39],
  shadowSize: [50, 64],
  iconAnchor: [12, 39],
  shadowAnchor: [4, 62],
  popupAnchor: [-3, -76],
  className: 'hand-pointer',
});

let tempMarker = L.marker([0, 0], { icon: redIcon });
var on = false;
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

function getWeatherData(city) {
  const locationContainer = document.getElementById('location-container');
  locationContainer.classList.remove('show');
  const params = {
    latitude: city.lat,
    longitude: city.lng,
    current: ['temperature_2m', 'weather_code'],
    hourly: ['temperature_2m', 'weather_code'],
    daily: ['weather_code', 'temperature_2m_max', 'temperature_2m_min'],
    timezone: 'Africa/Cairo',
    forecast_days: 1,
  };
  const queryString = new URLSearchParams(params).toString();
  const url = `https://api.open-meteo.com/v1/forecast?${queryString}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      let weatherCondition = weatherData[data.current.weather_code];

      const name = document.getElementsByClassName('city-name');
      name[0].innerText = city.city_name;

      const temperature = document.getElementsByClassName('temperature');
      temperature[0].innerText = `${Math.round(data.current.temperature_2m)}*`;

      const weather = document.getElementsByClassName('weather');
      weather[0].innerText = weatherCondition.day.description;

      const locationContainer =
        document.getElementsByClassName('location-container');
      locationContainer[0].style.backgroundImage = `url(${weatherDesign[weatherCondition.designNumber].image})`;

      const weatherCircle = document.getElementsByClassName('weather-circle');
      weatherCircle[0].style.backgroundColor =
        weatherDesign[weatherCondition.designNumber].colour;

      const range = document.getElementsByClassName('temperature-range');
      range[0].innerText = `L:  ${Math.round(data.daily.temperature_2m_min)}* H:${Math.round(data.daily.temperature_2m_max)}*`;
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  setTimeout(function () {
    locationContainer.classList.add('show');
  }, 200);
}
