class ForecastCard extends HTMLElement {
    static observedAttributes = ['high', 'low', 'current', 'condition', "city"];
    constructor() {
        super();
        this.innerHTML = `
        <div>
            <span id="city"></span>
            <span id="low"></span>
            <span id="high"></span>
            <span id="current"></span>
            <span id="condition"></span>  
        <div/>`;

    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(
            `Attribute: ${name} changed from ${oldValue} to ${newValue}`
        );

        const target = document.getElementById(name);

        if (!target) return;

        switch (name) {
            case 'high':
            case 'low':
            case 'current':
                if (isNaN(newValue)) {
                    target.innerText = "Nan";
                } else {
                    target.innerText = `${newValue}°C`;
                }
                break;
            default:
                target.innerText = newValue;
        }

        // document.getElementById(name).innerText = newValue;

        // if (['high', 'low', 'current', 'condition'].indexOf(name) > -1 && isNaN(newValue)){
        //     document.getElementById(name).innerText = 'Loading';

        // } else if (name === 'condition') {

        // }else if (name === 'city') {
            
        // }
        
    }
}
customElements.define('forecast-card', ForecastCard);
