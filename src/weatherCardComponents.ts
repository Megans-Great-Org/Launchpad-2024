class WeatherCard extends HTMLElement {
  static observedAttributes = ['time', 'icon', 'hourly-temperature'];

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `
    <style>
        #weather-card {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 8rem;
            width: 6rem;
            border-radius: 1rem;
            color: white;
            margin: 5px;
            background-color: rgba(0, 0, 0, 0.4);
        }

        #time {
            font-size: 18px;
            margin: 0%;
        }

        #hourly-temperature {
            font-size: 15px;
            margin: 0%;
        }

        #weather-icon {
            height: 50px;
            width: 50px;
            margin: 0 10px;
    }
    </style>
    <div id="weather-card">
        <h2 id="time"></h2>
        <img id="weather-icon" src="" alt="Weather Icon" />
        <h3 id="hourly-temperature"></h3>
    </div>
    `;
  }
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    const time = this.shadowRoot?.getElementById('time');
    const icon = this.shadowRoot?.getElementById(
      'weather-icon',
    ) as HTMLImageElement;
    const hourlyTemperature =
      this.shadowRoot?.getElementById('hourly-temperature');
    if (name === 'time' && time) {
      time.innerText = newValue;
    } else if (name === 'icon' && icon) {
      icon.src = newValue;
    } else if (name === 'hourly-temperature' && hourlyTemperature) {
      hourlyTemperature.innerText = newValue;
    }
  }
}

customElements.define('weather-card', WeatherCard);
