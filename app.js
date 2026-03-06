const API_KEY = '03fd5362cee2fd702fcd428b7bdefbea';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherDisplay = document.getElementById('weather-display');


// Loading state
function showLoading() {
    weatherDisplay.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Loading weather...</p>
        </div>
    `;
}


// Error message
function showError(message) {
    weatherDisplay.innerHTML = `
        <div class="error-message">
            <h3>⚠️ Error</h3>
            <p>${message}</p>
        </div>
    `;
}


// Fetch weather data (ASYNC / AWAIT)
async function getWeather(city) {

    showLoading();

    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    try {

        const response = await axios.get(url);

        console.log("Weather Data:", response.data);

        displayWeather(response.data);

    } catch (error) {

        console.error("Error fetching weather:", error);

        if (error.response && error.response.status === 404) {
            showError("City not found. Please check spelling.");
        } else {
            showError("Something went wrong. Please try again.");
        }

    }
}


// Display weather
function displayWeather(data) {

    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;

    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    const weatherHTML = `
        <div class="weather-info">
            <h2 class="city-name">${cityName}</h2>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <div class="temperature">${temperature}°C</div>
            <p class="description">${description}</p>
        </div>
    `;

    weatherDisplay.innerHTML = weatherHTML;

    cityInput.focus();
}


// Search button click
searchBtn.addEventListener("click", function () {

    const city = cityInput.value.trim();

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    if (city.length < 2) {
        showError("City name is too short.");
        return;
    }

    getWeather(city);

    cityInput.value = "";

});


// Enter key support
cityInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {
        searchBtn.click();
    }

});


// Welcome message instead of default city
weatherDisplay.innerHTML = `
    <div class="welcome-message">
        <h2>🌤 SkyFetch Weather</h2>
        <p>Enter a city name to get started!</p>
    </div>
`;