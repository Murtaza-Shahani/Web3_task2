const apiKey = "0a5aa13440037f77d676e0e53c0ee263";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

const searchBox = document.querySelector(".Search-box input");
const searchBtn = document.querySelector(".Search-box button");
const errorMessage = document.getElementById("error-message");
const weatherInfo = document.querySelector(".weather-info");
const forecastContainer = document.getElementById("forecast");

let tempCelsius;
let isCelsius = true;



// Function to get user address by latitude and longitude
// API key and URL
const api_endpoint = "https://api.opencagedata.com/geocode/v1/json";
const api_key = "1e18d634cc314e21bc3d3c21a925cd0a";

let user_city = "";

const getUserAddress = async (latitude, longitude) => {
  let query = `${latitude},${longitude}`;
  let api_url = `${api_endpoint}?key=${api_key}&q=${query}&pretty=1`;

  try {
    let res = await fetch(api_url);
    const data = await res.json();
    console.log(data);
    user_city = data.results[0].components.state;
    console.log(`here is the user's current city ${user_city}`);

    getWeather(user_city);
    getForecast(user_city);
  } catch (err) {
    console.log("Error using fetching OpenCage API");
    console.log(err);
  }
};

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      getUserAddress(latitude, longitude);
    },
    (error) => {
      errorMessage.style.display = "block";
      console.log(error.message);
      errorMessage.innerHTML = error.message;
    }
  );
}

const getWeather = async (city) => {
  try {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();

    errorMessage.style.display = 'none';
    weatherInfo.style.display = 'block';
    document.getElementById("city").innerHTML = data.name;
    tempCelsius = data.main.temp;
    updateTemperature();
    document.getElementById("humidity").innerHTML = data.main.humidity + "% humidity";
    document.getElementById("wind-speed").innerHTML = data.wind.speed + " km/h wind-speed";
  } catch (error) {
    weatherInfo.style.display = 'none';
    errorMessage.style.display = 'block';
    errorMessage.innerHTML = 'City not found!';
    console.error("Error fetching weather data:", error);
  }
};

searchBtn.addEventListener("click", () => {
  const city = searchBox.value;
  getWeather(city);
  getForecast(city);
});

const updateTemperature = () => {
  if (isCelsius) {
    document.getElementById("temp").innerHTML = `${Math.round(tempCelsius)}°C`;
  } else {
    const tempFahrenheit = (tempCelsius * 9/5) + 32;
    document.getElementById("temp").innerHTML = `${Math.round(tempFahrenheit)}°F`;
  }
};

const toggleButton = document.getElementById("toggle-button");
toggleButton.addEventListener("click", () => {
  isCelsius = !isCelsius;
  updateTemperature();
  toggleButton.innerHTML = isCelsius ? "Show in °F" : "Show in °C";
});

const getForecast = async (city) => {
  try {
    const response = await fetch(forecastUrl + city + `&appid=${apiKey}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();

    displayForecast(data);
  } catch (error) {
    forecastContainer.innerHTML = '';
    console.error("Error fetching forecast data:", error);
  }
};

const displayForecast = (data) => {
  forecastContainer.innerHTML = '';

  const dailyData = {};
  data.list.forEach((item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!dailyData[date]) {
      dailyData[date] = [];
    }
    dailyData[date].push(item);
  });

  Object.keys(dailyData).forEach((date) => {
    const dayData = dailyData[date];
    const highTemp = Math.max(...dayData.map(item => item.main.temp_max));
    const lowTemp = Math.min(...dayData.map(item => item.main.temp_min));
    const description = dayData[0].weather[0].description;
    const icon = dayData[0].weather[0].icon;

    const forecastCard = document.createElement('div');
    forecastCard.className = 'forecast-card';
    forecastCard.innerHTML = `
      <h4>${new Date(date).toDateString()}</h4>
      <p>High: ${Math.round(highTemp)}°C</p>
      <p>Low: ${Math.round(lowTemp)}°C</p>
      <p>${description}</p>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" />
    `;

    forecastContainer.appendChild(forecastCard);
  });
};
