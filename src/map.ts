import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import { CityInterface} from '././interfaces';

const redIcon = L.icon({
  iconUrl: 'public/red-pin.png',

  iconSize: [25, 39],
  shadowSize: [50, 64],
  iconAnchor: [12, 39],
  shadowAnchor: [4, 62],
  popupAnchor: [-3, -76],
  className: 'hand-pointer',
});

let customMarker = L.marker([0, 0], { icon: redIcon });

export function initializeMap(): L.Map {
    const map = new L.Map('map').setView([-30.5595, 22.9375], 5); //set view to South Africa

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap',
    }).addTo(map);

    return map;
}

export function addPinsToMap(map: L.Map, cities: CityInterface[], weatherCallback: (city: CityInterface) => void): void {
  cities.forEach((city) => {
    const marker = L.marker([city.lat, city.lng], {
        riseOnHover: true,
        title: city.city_name,
        autoPanOnFocus: true,
    }).addTo(map);
    marker.options.riseOnHover = true;
    
    marker.on('click', function () {
        const { lat, lng } = marker.getLatLng();
        map.setView([lat, lng], map.getZoom());
        weatherCallback(city);
    });
  });
}

export function dropPinClickCallback(map: L.Map, on: boolean, weatherCallback: (city: CityInterface) => void): void {
  if (on) {
    map.on('click', function (event) {
      customMarker.remove();
      customMarker = L.marker(event.latlng, { icon: redIcon }).addTo(map);
      const city = {
        lat: event.latlng.lat,
        lng: event.latlng.lng,
        city_name: 'New Location',
      };
      weatherCallback(city);
    });
  } 
  else {
    map.off('click');
    customMarker.remove();
  }
}

export function mapSetViewCallback(map: L.Map, city: CityInterface){
  return function () {
    map.setView([city.lat, city.lng], map.getZoom());
  }
}