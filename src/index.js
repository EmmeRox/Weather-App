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
}

function searchCity(city) {
  let apiKey = "1fe785ac5639f522853d21f921fefa5e";
  let cityInput = document.querySelector("#enter-city").value;
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemp);
}

function searchCurrent(city) {
  let apiKey = "1fe785ac5639f522853d21f921fefa5e";
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

let fahrenheitLink = document.querySelector("#fahrenheit-link");
document.addEventListener("DOMContentLoaded", function () {
  fahrenheitLink.addEventListener("click", showFahTemp);
});

let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", currentLocation);

let form = document.querySelector("#form-input");
form.addEventListener("submit", search);
