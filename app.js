function WeatherApp(apiKey){

this.apiKey = apiKey;

this.weatherUrl =
"https://api.openweathermap.org/data/2.5/weather";

this.forecastUrl =
"https://api.openweathermap.org/data/2.5/forecast";

this.searchBtn =
document.getElementById("search-btn");

this.cityInput =
document.getElementById("city-input");

this.weatherDisplay =
document.getElementById("weather-display");

this.recentSection =
document.getElementById("recent-searches-section");

this.recentContainer =
document.getElementById("recent-searches-container");

this.recentSearches = [];

this.maxRecent = 5;

this.init();
}

WeatherApp.prototype.init = function(){

this.searchBtn.addEventListener(
"click",
this.handleSearch.bind(this)
);

this.cityInput.addEventListener(
"keypress",
function(e){

if(e.key==="Enter"){
this.handleSearch();
}

}.bind(this)
);

this.loadRecentSearches();
this.loadLastCity();
}

WeatherApp.prototype.handleSearch = function(){

const city = this.cityInput.value.trim();

if(!city){
alert("Enter city name");
return;
}

this.getWeather(city);
}

WeatherApp.prototype.getWeather = async function(city){

this.showLoading();

const weatherURL =
`${this.weatherUrl}?q=${city}&appid=${this.apiKey}&units=metric`;

try{

const [weather, forecast] = await Promise.all([
axios.get(weatherURL),
this.getForecast(city)
]);

this.displayWeather(weather.data);
this.displayForecast(forecast);

this.saveRecent(city);
localStorage.setItem("lastCity", city);

}catch(error){

this.showError("City not found");

}

}

WeatherApp.prototype.getForecast = async function(city){

const url =
`${this.forecastUrl}?q=${city}&appid=${this.apiKey}&units=metric`;

const response = await axios.get(url);

return response.data;

}

WeatherApp.prototype.displayWeather = function(data){

const name = data.name;

const temp = Math.round(data.main.temp);

const desc = data.weather[0].description;

const icon = data.weather[0].icon;

const iconUrl =
`https://openweathermap.org/img/wn/${icon}@2x.png`;

const html = `

<div class="weather-info">

<h2>${name}</h2>

<img class="weather-icon" src="${iconUrl}">

<div class="temperature">${temp}°C</div>

<p>${desc}</p>

</div>

`;

this.weatherDisplay.innerHTML = html;

}

WeatherApp.prototype.processForecast = function(data){

const daily = data.list.filter(function(item){
return item.dt_txt.includes("12:00:00");
});

return daily.slice(0,5);

}

WeatherApp.prototype.displayForecast = function(data){

const days = this.processForecast(data);

let html = `
<div class="forecast-section">
<h3>5-Day Forecast</h3>
<div class="forecast-container">
`;

days.forEach(function(day){

const date =
new Date(day.dt_txt).toLocaleDateString(
"en-US",
{weekday:"short"}
);

const temp =
Math.round(day.main.temp);

const desc =
day.weather[0].description;

const icon =
day.weather[0].icon;

const iconUrl =
`https://openweathermap.org/img/wn/${icon}.png`;

html += `
<div class="forecast-card">

<h4>${date}</h4>

<img src="${iconUrl}">

<p>${temp}°C</p>

<small>${desc}</small>

</div>
`;

});

html += "</div></div>";

this.weatherDisplay.innerHTML += html;

}

WeatherApp.prototype.showLoading = function(){

this.weatherDisplay.innerHTML =
`<p class="loading">Loading weather...</p>`;

}

WeatherApp.prototype.showError = function(msg){

this.weatherDisplay.innerHTML =
`<p class="error">${msg}</p>`;

}

WeatherApp.prototype.loadRecentSearches = function(){

const saved =
localStorage.getItem("recentSearches");

if(saved){
this.recentSearches = JSON.parse(saved);
}

this.displayRecent();

}

WeatherApp.prototype.saveRecent = function(city){

const name =
city.charAt(0).toUpperCase() +
city.slice(1).toLowerCase();

const index =
this.recentSearches.indexOf(name);

if(index>-1){
this.recentSearches.splice(index,1);
}

this.recentSearches.unshift(name);

if(this.recentSearches.length>this.maxRecent){
this.recentSearches.pop();
}

localStorage.setItem(
"recentSearches",
JSON.stringify(this.recentSearches)
);

this.displayRecent();

}

WeatherApp.prototype.displayRecent = function(){

this.recentContainer.innerHTML = "";

if(this.recentSearches.length===0){
this.recentSection.style.display="none";
return;
}

this.recentSection.style.display="block";

this.recentSearches.forEach(function(city){

const btn =
document.createElement("button");

btn.className="recent-search-btn";

btn.textContent=city;

btn.addEventListener(
"click",
function(){

this.cityInput.value=city;

this.getWeather(city);

}.bind(this)
);

this.recentContainer.appendChild(btn);

}.bind(this));

}

WeatherApp.prototype.loadLastCity = function(){

const lastCity =
localStorage.getItem("lastCity");

if(lastCity){
this.getWeather(lastCity);
}else{
this.weatherDisplay.innerHTML =
"<p>Search for a city</p>";
}

}

const app =
new WeatherApp("03fd5362cee2fd702fcd428b7bdefbea");