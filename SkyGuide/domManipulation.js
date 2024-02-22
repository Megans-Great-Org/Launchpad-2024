import weatherData from './weatherData.json';
import weatherDesign from './weatherDesign.json';

export function populateCurrentWeather(data, city) {
  const weatherCondition = weatherData[data.current.weather_code];

  const name = document.getElementsByClassName('city-name');
  name[0].innerText = city.city_name.toUpperCase();

  const temperature = document.getElementsByClassName('temperature');
  temperature[0].innerText = `${Math.round(data.current.temperature_2m)}°`;

  const weather = document.getElementsByClassName('weather');
  weather[0].innerText = weatherCondition.day.description;

  const locationContainer = document.getElementsByClassName(
    'daily-weather-container',
  );
  locationContainer[0].style.backgroundImage = `url(${weatherDesign[weatherCondition.designNumber].image})`;

  const weatherCircle = document.getElementsByClassName('weather-circle');
  weatherCircle[0].style.backgroundColor =
    weatherDesign[weatherCondition.designNumber].colour;

  const range = document.getElementsByClassName('temperature-range');
  range[0].innerText = `L:  ${Math.round(data.daily.temperature_2m_min)}° H:${Math.round(data.daily.temperature_2m_max)}°`;
}

export function populateHourlyWeather(data) {
  const weatherCondition = weatherData[data.current.weather_code];
  document.getElementById('hourly-weather-container').style.background =
    `linear-gradient(${weatherDesign[weatherCondition.designNumber].colour}, ${weatherDesign[weatherCondition.designNumber].blendColour})`;

  const hourlyWeatherList = document.getElementById('hourly-weather-list');

  const now = new Date();
  const currentHour = now.getHours();

  hourlyWeatherList.innerHTML = '';

  for (let i = currentHour; i < 24; i += 1) {
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
    image.src = weatherData[data.current.weather_code].day.image;
    image.className = 'weather-icon';
    hourlyWeather.appendChild(image);

    const temp = document.createElement('h3');
    temp.className = 'hourly-temperature';
    temp.innerText = `${Math.round(data.hourly.temperature_2m[i])}°`;
    hourlyWeather.appendChild(temp);

    hourlyWeatherList.appendChild(hourlyWeather);
  }
}
