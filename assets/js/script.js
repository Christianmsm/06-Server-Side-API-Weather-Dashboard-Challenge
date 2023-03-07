let previousSearch = document.getElementById("#previous-search");
let searchButton = document.getElementById("#search-button");
let lat = " "
let long = " "

let weather = {
    "apiKey": '12edc13e598daff111b6e26b1908c5c1',
    fetchWeather: function (city) {
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" 
        + city 
        + "&cnt=5&units=imperial&appid="
        + this.apiKey
        )
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));
    },
    displayWeather: function (data) {
     const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    console.log(name,icon,description,temp,humidity,speed)
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png"
    document.querySelector(".temperature").innerText = temp + "°F";
    document.querySelector(".description").innerText = description;
    document.querySelector(".humidity").innerText = "humidity: " + humidity + "%";
    document.querySelector(".wind").innerText = "Wind Speed: " + speed + "mph";
    console.log(data);
    lat = data.coord.lat
    long = data.coord.lon

    console.log(lat);
console.log(long)
    },
    search: function () {
     this.fetchWeather(document.querySelector(".search-bar").value);   
    }
};

document.querySelector("#search-button")
.addEventListener("click", function () {
weather.search();
});

document.querySelector(".search-bar")
.addEventListener("keyup", function (event) {
    if (event.key === "Enter")
    weather.search();
})

function forecastApi () {
    fetch ("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + lon)
    for (var i = 1; i < 6; i++);
}




function savedInput () {

searchButton.addEventListener("click", function(event) {
    event.preventDefault();
    
    var previousSearch = {
      search: previousSearch.value
    
    };
    
    localStorage.setItem("previous-search", JSON.stringify(previousSearch));
    
    });
}