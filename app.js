// Your OpenWeatherMap API Key
const API_KEY = "03fd5362cee2fd702fcd428b7bdefbea";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

// Function to fetch weather data
function getWeather(city) {

    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    // Show loading message
    document.getElementById("weather-display").innerHTML =
        '<p class="loading">Loading weather data...</p>';

    axios.get(url)
        .then(function (response) {
            console.log("Weather Data:", response.data);
            displayWeather(response.data);
        })
        .catch(function (error) {
            console.error("Error fetching weather:", error);

            document.getElementById("weather-display").innerHTML =
                '<p class="loading">Could not fetch weather data. Please try again.</p>';
        });
}

// Function to display weather data
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

    document.getElementById("weather-display").innerHTML = weatherHTML;
}

// Function for search button
function searchWeather() {

    const city = document.getElementById("city-input").value.trim();

    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    getWeather(city);
}

// Allow Enter key to search
document.getElementById("city-input").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        searchWeather();
    }
});

// Load default weather when page opens
getWeather("Paris");