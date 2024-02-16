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
  [-26.202, 28.044], // Johannesburg
  [-33.926, 18.423], // Cape Town
  [-29.858, 31.029], // Durban
  [-25.745, 28.188], // Pretoria
  [-33.961, 25.615], // Port Elizabeth
  [-29.121, 26.214], // Bloemfontein
  [-33.015, 27.912], // East London
  [-29.617, 30.393],  // Pietermaritzburg
  [-26.268, 27.858],  // Soweto
  [-26.188, 28.321], // Bononi
  [-25.996, 28.227], // Tembisa
  [-26.673, 27.926] // Vereeniging
  
];

cities.forEach(city => {
  L.marker(city).addTo(map); 
});
  
