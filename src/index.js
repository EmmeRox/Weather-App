let celciusTemperature = null;

function formatDate() {
  let date = new Date();

  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }

  let minute = date.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[date.getDay()];

  let formattedDate = `${day} ${hour}:${minute}`;
  let now = document.querySelector("#nowTime");
  now.innerHTML = formattedDate;
}

formatDate();

function getForecast(coordinates) {
  let apiKey = "f81614abe2395d5dfecd45b9298041de";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function search(event) {
  event.preventDefault();
  let city = document.querySelector("#enter-city");
  let name = document.querySelector("h2");
  name.innerHTML = city.value;
  searchCity(city);
  formatDate();
}

function showTemp(response) {
  let cityInput = response.data.name;
  let humid = response.data.main.humidity;
  let windy = Math.round(response.data.wind.speed);

  let city = document.querySelector("#city");
  let displayTemp = document.querySelector("#weather");
  let humidity = document.querySelector("#humid");
  let windSpeed = document.querySelector("#wind");
  let description = document.querySelector("#condition");
  let icon = document.querySelector("#main-image");
  let iconCode = response.data.weather[0].icon;

  celciusTemperature = Math.round(response.data.main.temp);

  description.innerHTML = response.data.weather[0].description;
  city.innerHTML = `${cityInput}`;
  displayTemp.innerHTML = `${celciusTemperature}`;
  humidity.innerHTML = `${humid}%`;
  windSpeed.innerHTML = `${windy} km/h`;
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${iconCode}@2x.png`
  );
  icon.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
  <div class="col-2">
    <div class="card mx-auto">
      <div class="card-body">
        <p class="card-space"><span class="forecast-date">${formatDay(
          forecastDay.dt
        )}</span></p>
        <p class="card-title forecast-temps">
          <span class="forecast-max">${Math.round(forecastDay.temp.max)}</span>
          <br>
          <span class="forecast-min">${Math.round(forecastDay.temp.min)}</span>
        </p>
        <img src="http://openweathermap.org/img/wn/${
          forecastDay.weather[0].icon
        }@2x.png" width="40"/>
      </div>
    </div>
  </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function searchCity(city) {
  let apiKey = "f81614abe2395d5dfecd45b9298041de";
  let cityInput = document.querySelector("#enter-city").value;
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemp);
}

function searchCurrent(city) {
  let apiKey = "f81614abe2395d5dfecd45b9298041de";
  let units = "metric";
  let latitude = city.coords.latitude;
  let longitude = city.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemp);
}

function currentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchCurrent);
  formatDate();
}

function showFahTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#weather");
  let fahrenheitTemp = (celciusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemp);
}

function showCelTemp(event) {
  event.preventDefault();
  let temperature = document.querySelector("#weather");
  temperature.innerHTML = celciusTemperature;
}

let fahrenheitLink = document.querySelector("#farenheit-link");
fahrenheitLink.addEventListener("click", showFahTemp);

let celsiusLink = document.querySelector("#celcius-link");
celsiusLink.addEventListener("click", showCelTemp);

let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", currentLocation);

let form = document.querySelector("#form-input");
form.addEventListener("submit", search);
