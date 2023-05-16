let searchButton = document.getElementById('search-btn');
let citySearchEl = document.getElementById ('city-search');
let cityListEl = document.getElementById ('city-history-list');
let cityButton = document.getElementsByClassName ('city-history');
let currentTimeEl = document.getElementById ('current-time');
let currentDateEl = document.getElementById ('todays-date');
let currentCityNameEl = document.getElementById ('current-city');
let tempEl = document.getElementById ('temp');
let windEl = document.getElementById ('wind');
let highLowTempEl = document.getElementById ('high-low');
let weatherIconEl = document.getElementById ('weather-icon');
let forecastContainerEl = document.getElementById ('fiveday-forecast');

const savedCities = {};

// fetches the weather from the open weather api
function getWeather() {

    forecastContainerEl.innerHTML = '';
    cityName = citySearchEl.value.trim();
    //API Key
    const apiKey = "12edc13e598daff111b6e26b1908c5c1";
    let weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;

    let forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial`;
    
    function saveCity(city) {
        if (savedCities[city]) {
            return;
        }
        
        let newCityDiv = document.createElement ("div");
        newCityDiv.className = "input-group mb-1 d-flex";

        newCityDiv.innerHTML = `
        <div class="input-group mb-1 d-flex">
            <button class="city-history btn btn-primary flex-grow-1">
                ${city}
            </button>
            <button id="delete-btn" class="btn btn-primary delete-city flex-grow-0">
                <i class="fa-solid fa-minus"></i>
            </button>
        </div>`;

        let parentDiv = document.querySelector(".city-history-list");
        parentDiv.appendChild(newCityDiv);

      
        savedCities[city] = newCityDiv;

        //saves the city button to the local storage
        localStorage.setItem("savedCities", JSON.stringify(Object.keys(savedCities)));
    }

    // resets the search bar back to the placeholder city name
    citySearchEl.value = '';
    citySearchEl.placeholder = 'Columbus';

    //gets the api weather data for the current day
    fetch(weatherURL)
        .then(response => response.json())
        .then((data) => {
            console.log(data);
            currentCityNameEl.textContent = data.name;
            tempEl.textContent = Math.floor(data.main.temp) + '°F';

            windEl.innerHTML = `<i class="fa fa-wind"></i> ${data.wind.speed} MPH`;

            lowTemp = Math.floor(data.main.temp_min) + '°F';
            highTemp = Math.floor(data.main.temp_max) + '°F';

            highLowTempEl.innerHTML = `<i class="fa fa-temperature-arrow-down"></i> ${lowTemp}` + ` <i class="fa fa-temperature-arrow-up"></i> ${highTemp}`;
            

            saveCity(data.name);

        });
    
    // gets the api weather data for the 5 day forecast
    fetch(forecastURL)
        .then(response => response.json())
        .then((data) => {
            const forecastData = data.list.filter(item => item.dt_txt.includes("12:00:00"));
            console.log(data);
                forecastData.forEach((forecast) => {
                let date = new Date(forecast.dt * 1000).toLocaleDateString("en-US" , {weekday: "short"});
                let iconCode = forecast.weather[0].icon;
                let tempLow = forecast.main.temp_min;
                let tempHigh = forecast.main.temp_max;
                let windSpeed = forecast.wind.speed;

                tempLow = Math.floor(forecast.main.temp_min) + '°F';
                tempHigh = Math.floor(forecast.main.temp_max) + '°F';

                let forecastDiv = document.createElement("div");
                forecastDiv.className = "col-2 py-4 text-center";

                forecastDiv.innerHTML = `
                <p class="forecast-date">${date}</p>
                <hr>
                <p><i class="fa fa-wind"></i> ${windSpeed}</p>
                <p><i class="fa fa-temperature-arrow-up"></i> ${tempHigh}</p>
                <p><i class="fa fa-temperature-arrow-down"></i> ${tempLow}</p>
                `;
                forecastContainerEl.appendChild(forecastDiv);
            });


        });
}

function loadSavedCities() {
    let cities = JSON.parse(localStorage.getItem("savedCities")) || [];

    cities.forEach((city) => {
        let newCityDiv = document.createElement ("div");
        newCityDiv.className = "input-group mb-1 d-flex";

        newCityDiv.innerHTML = `
        <div class="input-group mb-1 d-flex">
            <button class="city-history btn btn-primary flex-grow-1">
                ${city}
            </button>
            <button id="delete-btn" class="btn btn-primary delete-city flex-grow-0">
                <i class="fa-solid fa-minus"></i>
            </button>
        </div>`;

        let parentDiv = document.querySelector(".city-history-list");
        parentDiv.appendChild(newCityDiv);

        let deleteButton = newCityDiv.querySelector(".delete-city");

        //Removes the city from localStorage
        deleteButton.addEventListener("click", function () {
            parentDiv.removeChild(newCityDiv);
            delete savedCities[city];
            localStorage.setItem("savedCities", JSON.stringify(Object.keys(savedCities)));
          });

        savedCities[city] = newCityDiv;
    });
}

// When the page loads it'll display the last searched city
window.onload = function() {
    let loadedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
    loadSavedCities();
    if (loadedCities.length > 0){
        citySearchEl.value = loadedCities[0];
        getWeather();
    }
}

searchButton.addEventListener('click', getWeather);


// displays the weather from the saved cities in the left column
document.querySelector('.city-history-list').addEventListener('click', function(event) {
    if (event.target.classList.contains('city-history')) {
        let cityName = event.target.textContent;
        citySearchEl.value = cityName
        getWeather();
    }
});
