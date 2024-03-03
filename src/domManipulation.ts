import {
  CityInterface,
  CurrentWeatherDataInterface,
  HourlyWeatherDataInterface,
  WeatherInfoJsonInterface,
  WeatherDesignJsonInterface,
} from './interfaces';
import weatherDesignJson from './json_data/weatherDesignJson.json';
import weatherInfoJson from './json_data/weatherInfoJson.json';

addWeatherCloseButtonClickListener();

export function addHomeButtonClickListener(city: CityInterface, weatherCallback: (city: CityInterface) => void) {
  const homeButton = document.getElementById('home-button');
  if (homeButton) {
    homeButton.addEventListener('click', function(event){
      toggleNav();
      event.preventDefault();
      weatherCallback(city);
    });
  }
}

export function addCustomLocationButtonClickListener(weatherCallback: (city: CityInterface) => void, getCoordinatesCallback: () => CityInterface) {
  const customLocationButton = document.getElementById('add-custom-location');
  if (customLocationButton){ 
    customLocationButton.addEventListener('click', function(){
      const city = getCoordinatesCallback();
      addHomeButtonClickListener(city, weatherCallback);
    });
  }
}

function addWeatherCloseButtonClickListener(): void {
  const weatherCloseButton = document.getElementById('weather-close-button');
  if (weatherCloseButton)
    weatherCloseButton.addEventListener('click', hideWeatherContainer);
}

export function populateCurrentWeather(
  currentWeatherData: CurrentWeatherDataInterface,
  city: CityInterface,
) {
  const weatherInfo: WeatherInfoJsonInterface = weatherInfoJson;
  const weatherDesign: WeatherDesignJsonInterface = weatherDesignJson;

  const weatherCondition = weatherInfo[currentWeatherData.weatherCode];

  const name = document.getElementById('city-name');
  if (name) name.innerText = city.cityName.toUpperCase();

  if (city.cityName === 'Home') {
    const homeButton = document.getElementById('add-custom-location');
    if (homeButton) homeButton.classList.add('hidden');
  }
  else {
    const customLocationButton = document.getElementById('add-custom-location');
    customLocationButton?.classList.remove('hidden');
  }

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

    if(hourlyWeatherList) hourlyWeatherList.appendChild(hourlyWeather);
  }
}

export function toggleNav(): void {
  const sidepanel = document.getElementById('city-list');
  if (sidepanel) {
    sidepanel.classList.toggle('translate-x-64');
    sidepanel.classList.toggle('md:-translate-x-64');
  }
}

export function addListButtonClickListener(): void {
  const listButton = document.getElementById('city-list-button');
  if (listButton) listButton.addEventListener('click', toggleNav);
  if (listButton)
    listButton.addEventListener('click', function () {
      this.classList.toggle('md:hover:white');
      this.classList.toggle('md:hover:bg-blue-600');
      this.classList.toggle('bg-white');
      this.classList.toggle('text-blue-600');

      this.classList.toggle('md:hover:text-blue-600');
      this.classList.toggle('md:hover:bg-white');
      this.classList.toggle('bg-blue-600');
      this.classList.toggle('text-white');
    });
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

const customPinButton = document.getElementById('drop-pin');
if (customPinButton)
  customPinButton.addEventListener('click', function () {
    this.classList.toggle('md:hover-white');
    this.classList.toggle('md:hover-bg-blue-600');
    this.classList.toggle('bg-white');
    this.classList.toggle('text-blue-600');

    this.classList.toggle('md:hover-text-blue-600');
    this.classList.toggle('md:hover-bg-white');
    this.classList.toggle('bg-blue-600');
    this.classList.toggle('text-white');

    this.classList.toggle('cursor-pointer');
  });

export function hideWeatherContainer(): void {
  const locationContainer = document.getElementById('location-container');
  if (locationContainer) {
    locationContainer.classList.add('hidden');
    locationContainer.classList.remove('flex');
  }
}

export function showWeatherContainer(): void {
  const locationContainer = document.getElementById('location-container');
  if (locationContainer) {
    locationContainer.classList.remove('hidden');
    locationContainer.classList.add('flex');
  }
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
  cityButton.className =
  'hover:bg-transparent/10 text-white p-2 block hover:cursor-pointer text-lg md:text-xl w-full text-left px-8';
  cityButton.innerText = city.cityName;

  cityButton.addEventListener('click', function (event) {
    toggleNav();
    event.preventDefault();
    mapSetViewCallback();
    weatherCallback(city);
  });

  if (cityList) cityList.appendChild(cityButton);
}


