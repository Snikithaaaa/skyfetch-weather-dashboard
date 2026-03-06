const API_KEY = "03fd5362cee2fd702fcd428b7bdefbea";


// Constructor Function
function WeatherApp(apiKey) {

    this.apiKey = apiKey;

    this.apiUrl = "https://api.openweathermap.org/data/2.5/weather";
    this.forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";

    this.searchBtn = document.getElementById("search-btn");
    this.cityInput = document.getElementById("city-input");
    this.weatherDisplay = document.getElementById("weather-display");

    this.init();
}


// Initialize app
WeatherApp.prototype.init = function () {

    this.searchBtn.addEventListener(
        "click",
        this.handleSearch.bind(this)
    );

    this.cityInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            this.handleSearch();
        }
    });

    this.showWelcome();
};



// Welcome message
WeatherApp.prototype.showWelcome = function () {

    const html = `
        <div class="welcome-message">
            <h2>🌤 SkyFetch Weather</h2>
            <p>Search for a city to see weather & forecast</p>
        </div>
    `;

    this.weatherDisplay.innerHTML = html;
};



// Handle search
WeatherApp.prototype.handleSearch = function () {

    const city = this.cityInput.value.trim();

    if (!city) {
        this.showError("Please enter a city name");
        return;
    }

    if (city.length < 2) {
        this.showError("City name too short");
        return;
    }

    this.getWeather(city);

    this.cityInput.value = "";
};



// Fetch weather + forecast
WeatherApp.prototype.getWeather = async function (city) {

    this.showLoading();

    this.searchBtn.disabled = true;
    this.searchBtn.textContent = "Searching...";

    const currentWeatherUrl =
        `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`;

    try {

        const [currentWeather, forecastData] = await Promise.all([

            axios.get(currentWeatherUrl),
            this.getForecast(city)

        ]);

        this.displayWeather(currentWeather.data);

        this.displayForecast(forecastData);

    }
    catch (error) {

        console.error(error);

        if (error.response && error.response.status === 404) {

            this.showError("City not found. Check spelling.");

        } else {

            this.showError("Something went wrong. Try again.");

        }

    }
    finally {

        this.searchBtn.disabled = false;
        this.searchBtn.textContent = "Search";

    }

};



// Fetch forecast
WeatherApp.prototype.getForecast = async function (city) {

    const url =
        `${this.forecastUrl}?q=${city}&appid=${this.apiKey}&units=metric`;

    const response = await axios.get(url);

    return response.data;

};



// Display current weather
WeatherApp.prototype.displayWeather = function (data) {

    const city = data.name;

    const temp = Math.round(data.main.temp);

    const description = data.weather[0].description;

    const icon = data.weather[0].icon;

    const iconUrl =
        `https://openweathermap.org/img/wn/${icon}@2x.png`;

    const html = `
        <div class="weather-info">
            <h2>${city}</h2>

            <img src="${iconUrl}" />

            <div class="temperature">${temp}°C</div>

            <p>${description}</p>
        </div>
    `;

    this.weatherDisplay.innerHTML = html;

    this.cityInput.focus();

};



// Process forecast (pick 12:00 each day)
WeatherApp.prototype.processForecastData = function (data) {

    const daily = data.list.filter(function (item) {

        return item.dt_txt.includes("12:00:00");

    });

    return daily.slice(0, 5);

};



// Display forecast cards
WeatherApp.prototype.displayForecast = function (data) {

    const forecasts = this.processForecastData(data);

    const forecastHTML = forecasts.map(function (day) {

        const date = new Date(day.dt * 1000);

        const dayName =
            date.toLocaleDateString("en-US", { weekday: "short" });

        const temp = Math.round(day.main.temp);

        const desc = day.weather[0].description;

        const icon = day.weather[0].icon;

        const iconUrl =
            `https://openweathermap.org/img/wn/${icon}@2x.png`;

        return `
            <div class="forecast-card">
                <h4>${dayName}</h4>
                <img src="${iconUrl}">
                <div class="forecast-temp">${temp}°C</div>
                <p>${desc}</p>
            </div>
        `;

    }).join("");



    const section = `
        <div class="forecast-section">
            <h3>5-Day Forecast</h3>
            <div class="forecast-container">
                ${forecastHTML}
            </div>
        </div>
    `;

    this.weatherDisplay.innerHTML += section;

};



// Loading
WeatherApp.prototype.showLoading = function () {

    this.weatherDisplay.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;

};



// Error
WeatherApp.prototype.showError = function (message) {

    this.weatherDisplay.innerHTML = `
        <div class="error-message">
            <h3>⚠ Error</h3>
            <p>${message}</p>
        </div>
    `;

};



// Create App Instance
const app = new WeatherApp(API_KEY);