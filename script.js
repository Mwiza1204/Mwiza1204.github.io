document.getElementById('search-btn').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    const apiKey = '39b9f95188231262e195a7c858c38aa3'; // Replace with your OpenWeatherMap API key
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    
    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            document.querySelector('.temp').innerText = `${data.main.temp}°C`;
            document.querySelector('.city').innerText = data.name;
            document.querySelector('.humidity').innerText = `${data.main.humidity}%`;
            document.querySelector('.wind').innerText = `${data.wind.speed} km/h`;
            document.querySelector('.rain').innerText = `${data.rain ? data.rain['1h'] : '0'} mm`;
            updateDateTime();
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            const forecastList = data.list;
            const forecastContainer = document.querySelector('.weather-cards');
            forecastContainer.innerHTML = ''; // Clear previous forecast
            

            for (let i = 0; i < forecastList.length; i += 8) { // Get forecast for every 24 hours
                const forecast = forecastList[i];
                const date = new Date(forecast.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
                const temp = forecast.main.temp;
                const wind = forecast.wind.speed;
                const humidity = forecast.main.humidity;
                const icon = forecast.weather[0].icon;
                const iconUrl = `http://openweathermap.org/img/wn/${icon}.png`;

                const forecastCard = document.createElement('li');
                forecastCard.classList.add('card');
                forecastCard.innerHTML = `
                    <h3>${date}</h3>
                    <img src="${iconUrl}" alt="Weather Icon">
                    <h6>Temp: ${temp}°C</h6>
                    <h6>Wind: ${wind} m/s</h6>
                    <h6>Humidity: ${humidity}%</h6>
                `;
                forecastContainer.appendChild(forecastCard);
            }
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });
});

function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    document.getElementById('datetime').innerText = now.toLocaleDateString('en-US', options);
}

setInterval(updateDateTime, 1000);
updateDateTime();


// Function to change the background video based on weather description
function changeBackgroundVideo(weatherDescription) {
    const backgroundVideo = document.getElementById("background-video");
    const source = backgroundVideo.querySelector("source");

    if (weatherDescription.includes("clear")) {
        source.src = "videos/clear sky.mp4";
    } else if (weatherDescription.includes("cloud")) {
        source.src = "videos/Cloudy Q.mp4";
    } else if (weatherDescription.includes("rain")) {
        source.src = "videos/Rainy 1 Q.mp4";
    } else if (weatherDescription.includes("snow")) {
        source.src = "videos/snoww vid.mp4";
    } else if (weatherDescription.includes("storm")) {
        source.src = "videos/storm vid.mp4";
    } else {
        source.src = "videos/default.mp4";
    }

    backgroundVideo.load(); // Reload the video to apply the new source
}

// Example API integration (fetching weather data)
document.getElementById("search-btn").addEventListener("click", async () => {
    const cityInput = document.getElementById("city-input").value;
    const apiKey = "d7c6b08bdac6b50e2909a96795e974a0"; // Replace with your OpenWeatherMap API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.cod === 200) {
            // Update UI elements
            document.querySelector(".temp").textContent = `${data.main.temp}°C`;
            document.querySelector(".city").textContent = data.name;
            document.querySelector(".description").textContent = data.weather[0].description;
            document.querySelector(".humidity").textContent = `${data.main.humidity}%`;
            document.querySelector(".wind").textContent = `${data.wind.speed} km/h`;

            // Change background video based on weather description
            changeBackgroundVideo(data.weather[0].description);
        } else {
            alert("City not found! Please enter a valid city.");
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
});





// Function to display the map
function displayMap(lat, lon, cityName) {
    const mapContainer = document.getElementById("map-container");
    const mapCityName = document.getElementById("map-city-name");

    // Show the map container
    mapContainer.style.display = "block";
    mapCityName.textContent = cityName;

    // Initialize the map
    const map = L.map("map").setView([lat, lon], 13);

    // Add tile layer to the map
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Add a marker for the city's location
    L.marker([lat, lon]).addTo(map).bindPopup(`${cityName}`).openPopup();
}

// Add event listener to search button
document.getElementById("search-btn").addEventListener("click", async () => {
    const cityInput = document.getElementById("city-input").value;
    const apiKey = "d7c6b08bdac6b50e2909a96795e974a0"; // Replace with your OpenWeatherMap API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.cod === 200) {
            // Update weather details
            document.querySelector(".temp").textContent = `${data.main.temp}°C`;
            document.querySelector(".city").textContent = data.name;
            document.querySelector(".description").textContent = data.weather[0].description;
            document.querySelector(".humidity").textContent = `${data.main.humidity}%`;
            document.querySelector(".wind").textContent = `${data.wind.speed} km/h`;

            // Display the map for the city's coordinates
            const lat = data.coord.lat;
            const lon = data.coord.lon;
            displayMap(lat, lon, data.name);
        } else {
            alert("City not found! Please enter a valid city.");
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
});


