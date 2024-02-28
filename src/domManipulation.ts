import {
  CityInterface,
  CurrentWeatherDataInterface,
  HourlyWeatherDataInterface,
  WeatherInfoJsonInterface,
  WeatherDesignJsonInterface,
} from './interfaces';
import weatherDesignJson from './json_data/weatherDesignJson.json';
import weatherInfoJson from './json_data/weatherInfoJson.json';

addDropPinClickListener(() => {
  toggleCustomPinButton();
  toggleMapHandPointer();
});

export function populateCurrentWeather(
  currentWeatherData: CurrentWeatherDataInterface,
  city: CityInterface,
) {
  const locationContainer = document.getElementById('location-container');
  locationContainer ? locationContainer.classList.remove('show') : 0;

  const weatherInfo: WeatherInfoJsonInterface = weatherInfoJson;
  const weatherDesign: WeatherDesignJsonInterface = weatherDesignJson;

  const weatherCondition = weatherInfo[currentWeatherData.weatherCode];

  const name = document.getElementById('city-name');
  if (name) name.innerText = city.city_name.toUpperCase();

  const temperature = document.getElementById('temperature');
  if (temperature)
    temperature.innerText = `${Math.round(currentWeatherData.temperature)}°`;

  const weather = document.getElementById('weather');
  if (weather) weather.innerText = weatherCondition.day.description;

  const weatherContainer = document.getElementById('daily-weather-container');
  if (weatherContainer)
    weatherContainer.style.backgroundImage = `url(${weatherDesign[weatherCondition.designNumber].image})`;

  const weatherCircle = document.getElementById('weather-circle');
  if (weatherCircle)
    weatherCircle.style.backgroundColor =
      weatherDesign[weatherCondition.designNumber].colour;

  const range = document.getElementById('temperature-range');
  if (range)
    range.innerText = `L:  ${Math.round(currentWeatherData.temperatureMin)}° H: ${Math.round(currentWeatherData.temperatureMin)}°`;
}

export function populateHourlyWeather(
  hourlyWeatherData: HourlyWeatherDataInterface,
  currentWeatherData: CurrentWeatherDataInterface,
) {
  const weatherInfo: WeatherInfoJsonInterface = weatherInfoJson;
  const weatherDesign: WeatherDesignJsonInterface = weatherDesignJson;

  const weatherCondition = weatherInfo[currentWeatherData.weatherCode];

  const hourlyWeatherContainer = document.getElementById(
    'hourly-weather-container',
  );
  if (hourlyWeatherContainer)
    hourlyWeatherContainer.style.background = `linear-gradient(${weatherDesign[weatherCondition.designNumber].colour}, ${weatherDesign[weatherCondition.designNumber].blendColour})`;

  const hourlyWeatherList = document.getElementById('hourly-weather-list');
  if (hourlyWeatherList) hourlyWeatherList.innerHTML = '';

  const now = new Date();
  const currentHour = now.getHours();

  for (let i = currentHour; i < hourlyWeatherData.dataList.length; i += 1) {
    const hourlyWeatherCode = hourlyWeatherData.dataList[i].weatherCode;

    const hourlyWeather = document.createElement('div');
    hourlyWeather.className = 'hourly-weather';
    hourlyWeather.style.backgroundColor =
      weatherDesign[weatherCondition.designNumber].colour;

    const time = document.createElement('h2');
    time.className = 'time';
    time.innerText = `${i}:00`;
    if (i === currentHour) {
      time.innerText = 'Now';
    }
    hourlyWeather.appendChild(time);

    const image = document.createElement('img');
    image.src = weatherInfo[hourlyWeatherCode].day.image;
    image.alt = weatherInfo[hourlyWeatherCode].day.description;
    image.className = 'weather-icon';
    hourlyWeather.appendChild(image);

    const hourlyTemperature = document.createElement('h3');
    hourlyTemperature.className = 'hourly-temperature';
    hourlyTemperature.innerText = `${Math.round(hourlyWeatherData.dataList[i].temperature)}°`;
    hourlyWeather.appendChild(hourlyTemperature);

    hourlyWeatherList ? hourlyWeatherList.appendChild(hourlyWeather) : null;
  }
}

export function toggleNav(): void {
  const sidepanel = document.getElementById('city-list');
  if (sidepanel) {
    if (sidepanel.style.width === '250px') {
      sidepanel.style.width = '0';
    } else {
      sidepanel.style.width = '250px';
    }
  }
}

export function addListButtonClickListener(): void {
  const listButton = document.getElementById('city-list-button');
  if (listButton) listButton.addEventListener('click', toggleNav);
}

export function addCloseButtonClickListener(): void {
  const closeButton = document.getElementById('close-button');
  if (closeButton) closeButton.addEventListener('click', toggleNav);
}

export function toggleClass(element: Element, className: string) {
  if (element.classList.contains(className)) {
    element.classList.remove(className);
  } else {
    element.classList.add(className);
  }
}

function toggleCustomPinButton(): void {
  const dropPin = document.getElementById('drop-pin');
  if (dropPin) toggleClass(dropPin, 'clicked-button');
}

function toggleMapHandPointer(): void {
  const mapContainer = document.querySelector('.leaflet-container');
  if (mapContainer) toggleClass(mapContainer, 'hand-pointer');
}

export function toggleWeatherContainer(): void {
  const locationContainer = document.getElementById('location-container');
  if (locationContainer) toggleClass(locationContainer, 'show');
}

export function addDropPinClickListener(callback: () => void): void {
  const dropPin = document.getElementById('drop-pin');
  if (dropPin) {
    dropPin.addEventListener('click', callback);
  }
}

export function cityFunctionality(
  city: CityInterface,
  weatherCallback: (city: CityInterface) => void,
  mapSetViewCallback: () => void,
): void {
  const cityList = document.getElementById('city-list');
  const cityButton = document.createElement('button');
  cityButton.innerText = city.city_name;

  cityButton.addEventListener('click', function (event) {
    toggleNav();
    event.preventDefault();
    mapSetViewCallback();
    weatherCallback(city);
  });

  if (cityList) cityList.appendChild(cityButton);
}
