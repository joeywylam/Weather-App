// script.js

document.getElementById('getWeatherButton').addEventListener('click', getWeather);

async function getWeather() {
    const city = document.getElementById('cityInput').value.trim();
    if (city === "") {
        alert("Please enter a city name!");
        return;
    }

    const apiKey = '3e6004e97e40f56c2baee2e97515bff9';  // Replace with your OpenWeatherMap API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("City not found");
        }
        const weatherData = await response.json();
        displayWeather(weatherData);
    } catch (error) {
        alert(error.message);
    }
}

function displayWeather(data) {
    const weatherDisplay = document.getElementById('weatherDisplay');
    const { name, main, weather } = data;

    weatherDisplay.innerHTML = `
        <h2>${name}</h2>
        <p>Temperature: ${main.temp}°C</p>
        <p>Weather: ${weather[0].description}</p>
        <p>Humidity: ${main.humidity}%</p>
    `;
}
