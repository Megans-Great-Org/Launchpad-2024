import weatherData from './weatherData.json';
import weatherDesign from './weatherDesign.json';

export function getWeatherData(city) {
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

export default getWeatherData;
