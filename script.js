document.getElementById('getWeatherButton').addEventListener('click', getWeather);
document.getElementById('useMyLocationButton').addEventListener('click', getWeatherByLocation);
document.getElementById('getForecastButton').addEventListener('click', get7DayForecast);

async function getWeather() {
    const city = document.getElementById('cityInput').value.trim();
    if (city === "") {
        alert("Please enter a city name!");
        return;
    }

    const apiKey = '9518fa615117c2b8495593e627a6aad5';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("City not found");
        }
        const weatherData = await response.json();
        displayWeather(weatherData);
        saveRecentSearch(city);
        displayRecentSearches();
    } catch (error) {
        alert(error.message);
    }
}

async function getWeatherByLocation() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const apiKey = '9518fa615117c2b8495593e627a6aad5';
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error("Unable to get weather for your location");
            }
            const weatherData = await response.json();
            displayWeather(weatherData);
        } catch (error) {
            alert(error.message);
        }
    }, () => {
        alert("Unable to retrieve your location.");
    });
}

async function get7DayForecast() {
    const city = document.getElementById('cityInput').value.trim();
    if (city === "") {
        alert("Please enter a city name!");
        return;
    }

    const apiKey = '9518fa615117c2b8495593e627a6aad5';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=7&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("City not found");
        }
        const forecastData = await response.json();
        displayForecast(forecastData);
    } catch (error) {
        alert(error.message);
    }
}

function displayWeather(data) {
    const weatherDisplay = document.getElementById('weatherDisplay');
    const { name, main, weather } = data;

    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

    weatherDisplay.innerHTML = `
        <h2>${name}</h2>
        <img src="${iconUrl}" alt="${weather[0].description}">
        <p>Temperature: ${main.temp}°C</p>
        <p>Weather: ${weather[0].description}</p>
        <p>Humidity: ${main.humidity}%</p>
    `;
}

function displayForecast(data) {
    const weatherDisplay = document.getElementById('weatherDisplay');
    const { city, list } = data;

    let forecastHTML = `<h2>7-Day Forecast for ${city.name}</h2>`;
    list.forEach(day => {
        const date = new Date(day.dt * 1000).toDateString();
        const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

        forecastHTML += `
            <div class="forecast-day">
                <h3>${date}</h3>
                <img src="${iconUrl}" alt="${day.weather[0].description}">
                <p>Temperature: ${day.temp.day}°C</p>
                <p>Weather: ${day.weather[0].description}</p>
                <p>Humidity: ${day.humidity}%</p>
            </div>
        `;
    });

    weatherDisplay.innerHTML = forecastHTML;
}

function saveRecentSearch(city) {
    let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
    if (!recentCities.includes(city)) {
        recentCities.push(city);
        localStorage.setItem('recentCities', JSON.stringify(recentCities));
    }
}

function displayRecentSearches() {
    const recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
    const recentSearchesContainer = document.getElementById('recentSearches');

    let recentHTML = "<h3>Recent Searches:</h3>";
    recentCities.forEach(city => {
        recentHTML += `<button onclick="getWeatherByCity('${city}')">${city}</button>`;
    });

    recentSearchesContainer.innerHTML = recentHTML;
}

function getWeatherByCity(city) {
    document.getElementById('cityInput').value = city;
    getWeather();
}

// Call this function when the page loads to display any saved searches
document.addEventListener("DOMContentLoaded", displayRecentSearches);
