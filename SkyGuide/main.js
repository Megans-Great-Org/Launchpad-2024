import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

const map = L.map('map').setView([-30.5595, 22.9375], 5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

const cities = [
  { lat: -26.202, lng: 28.044, city_name: "JOHANNESBURG" }, 
  { lat: -33.926, lng: 18.423, city_name: "CAPE TOWN" },
  { lat: -29.858, lng: 31.029, city_name: "DURBAN" },
  { lat: -25.745, lng: 28.188, city_name: "PRETORIA" },
  { lat: -33.961, lng: 25.615, city_name: "PORT ELIZABETH" },
  { lat: -29.121, lng: 26.214, city_name: "BLOEMFONTEIN" },
  { lat: -33.015, lng: 27.912, city_name: "EAST LONDON" },
  { lat: -29.617, lng: 30.393, city_name: "PIETERMARITZBURG" },
  { lat: -26.268, lng: 27.858, city_name: "SOWETO" },
  { lat: -26.188, lng: 28.321, city_name: "BONONI" },
  { lat: -25.996, lng: 28.227, city_name: "TEMBISA" },
  { lat: -26.673, lng: 27.926, city_name: "VEREENIGING" }
];

const weatherConditions = [
  { code: 0, condition: 'Clear', image: 'assets/clear.jpeg', colour: '#F8C68C'},
  { code: 1, condition: 'Partly Cloudy', image: 'assets/partly-clouds.jpeg', colour: '#52BBE8'},
  { code: 2, condition: 'Cloudy', image: 'assets/partly-clouds.jpeg', colour: '#52BBE8'},
  { code: 3, condition: 'Overcast', image: 'assets/partly-clouds.jpeg', colour: '#52BBE8'},
  { code: 4, condition: 'Fog', image: 'assets/fog.jpeg,', colour: '#D28491'},
  { code: 5, condition: 'Freezing Fog', image: 'assets/fog.jpeg', colour: '#D28491'},
  { code: 6, condition: 'Drizzle', image: 'assets/rain.jpeg', colour: '#348CB4'},
  { code: 7, condition: 'Rain', image: 'assets/rain.jpeg', colour: '#348CB4'},
  { code: 8, condition: 'Freezing Rain', image: 'assets/thunder-storm.jpeg', colour: '#194356'},
  { code: 9, condition: 'Snow', image: 'assets/thunder-storm.jpeg', colour: '#194356'},
  { code: 10, condition: 'Heavy Snow', image: 'assets/thunder-storm.jpeg', colour: '#194356'},
  { code: 11, condition: 'Sleet', image: 'assets/thunder-storm.jpeg', colour: '#194356'},
];

cities.forEach(city => {
  const marker = L.marker([city.lat, city.lng], {
    riseOnHover: true,
    title: city.city_name,
    autoPanFocus: true,
  }).addTo(map); 
  marker.options.riseOnHover = true;
  
  const cityList = document.getElementById("city-list");
  const a = document.createElement("a");
  a.href = "#"; //remember to set href
  a.innerText = city.city_name;
  cityList.appendChild(a);
  
  marker.on('click', function() {
    const { lat, lng } = marker.getLatLng();


    const params = {
      "latitude": lat,
      "longitude": lng,
      "current": ["temperature_2m", "weather_code"],
      "hourly": ["temperature_2m", "weather_code"],
      "daily": ["weather_code", "temperature_2m_max", "temperature_2m_min"],
      "timezone": "Africa/Cairo",
      "forecast_days": 1
    };
    const queryString = new URLSearchParams(params).toString();
    const url = `https://api.open-meteo.com/v1/forecast?${queryString}`;

    fetch(url)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
        console.log(data);

        const name = document.getElementsByClassName("city-name");
        name[0].innerText = city.city_name;

        const temperature = document.getElementsByClassName("temperature");
        temperature[0].innerText = `${Math.round(data.current.temperature_2m)}*`;

        const weather = document.getElementsByClassName("weather");
        weather[0].innerText = weatherConditions[data.current.weather_code].condition;

        const locationContainer = document.getElementsByClassName("location-container");
        locationContainer[0].style.backgroundImage = `url(${weatherConditions[data.current.weather_code].image})`;

        const weatherCircle = document.getElementsByClassName("weather-circle");
        weatherCircle[0].style.backgroundColor = weatherConditions[data.current.weather_code].colour;

        const range = document.getElementsByClassName("temperature-range");
        range[0].innerText = `L:  ${Math.round(data.daily.temperature_2m_min)}* H:${Math.round(data.daily.temperature_2m_max)}*`;

      })
      .catch(error => {
          console.error('Error fetching data:', error);
      });

  });
});


let redIcon = L.icon({
  iconUrl: 'assets/red-pin.png',

  iconSize:     [25, 39], 
  shadowSize:   [50, 64],
  iconAnchor:   [12, 39], 
  shadowAnchor: [4, 62],  
  popupAnchor:  [-3, -76] 
});

let tempMarker = L.marker([0,0], {icon: redIcon});
var on = false;
document.getElementById('drop-pin').addEventListener('click', function() {
  tempMarker.remove();
  on = !on;
  if (on) {
      document.getElementById('drop-pin').classList.add('clicked-button');
      map.on('click', function(event) {
        tempMarker.remove();
        tempMarker = L.marker(event.latlng, {icon: redIcon}).addTo(map);
    });
  } else {
    document.getElementById('drop-pin').classList.remove('clicked-button');
    map.on('click', function(event) {
      tempMarker.remove();
    });
  }
});


