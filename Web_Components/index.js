const cities = [
    {
        name: "Pretoria",
        high: 32,
        low: 25,
        current: 29,
        condition: "Sunny"
    },
    {
        name: "Durban",
        high: 30,
        low: 20,
        current: 25,
        condition: "Rainy"
    },
    {
        name: "Cape Town",
        high: 25,
        low: 20,
        current: 22,
        condition: "Cloudy"
    },
];

for (const city of cities) {
    const { name, high, low, current, condition } = city;
    if (!(name && high && low && current && condition)) {
        continue;
    }

    const card = document.createElement('forecast-card');
    card.setAttribute('id', name);
    card.setAttribute('city', city.name);
    card.setAttribute('high', city.high);
    card.setAttribute('low', city.low);
    card.setAttribute('current', city.current);
    card.setAttribute('condition', city.condition);
    document.querySelector('body').appendChild(card);
}

setInterval(() => {
    const cityToChange = cities.at(Mat.floor(Math.random () * cities.length));
    const newCurrentTemp = cityToChange.low + (cityToChange.high - cityToChange.low) * Math.random();
    cityToChange.current = newCurrentTemp;

    //DOM update

    const domElementb = document.hetElementById(cityToChange.name);
    if (domElementb) {
        domElementb.setAttribute('current', Math.round(newCurrentTemp));
    }
}, 1000);
