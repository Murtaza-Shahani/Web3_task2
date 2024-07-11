const apiKey = "0a5aa13440037f77d676e0e53c0ee263";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".Search-box input");
const searchBtn = document.querySelector(".Search-box button");
const errorMessage = document.getElementById("error-message");
const weatherInfo = document.querySelector(".weather-info");

let tempCelsius;
let isCelsius = true;

// Geolocation part
const show_detail = document.querySelector(".show_detail");
const full_address = document.querySelector(".full_address");
const address = document.querySelector(".address");

// Function to get user address by latitude and longitude
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
    
    user_city =  data.results[0].components.state;

    if (user_city) {
      getWeather(user_city);
    } else {
      throw new Error("Unable to determine the city from geolocation.");
    }
  } catch (err) {
    console.log("Error using fetching OpenCage API");
    console.log(err);
    errorMessage.style.display = "block";
    errorMessage.innerHTML = "Unable to determine your location. Please search manually.";
  }
};

// Get user location
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
    const data = await response.json();
    
    if (response.ok) {
      errorMessage.style.display = 'none';
      weatherInfo.style.display = 'block';
      document.getElementById("city").innerHTML = data.name;
      tempCelsius = data.main.temp;
      updateTemperature();
      document.getElementById("humidity").innerHTML = data.main.humidity + "% humidity";
      document.getElementById("wind-speed").innerHTML = data.wind.speed + " km/h wind-speed";
    } else {
      weatherInfo.style.display = 'none';
      errorMessage.style.display = 'block';
      
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    errorMessage.style.display = 'block';
    errorMessage.innerHTML = "Error fetching weather data.";
  }
};

const updateTemperature = () => {
  if (isCelsius) {
    document.getElementById("temp").innerHTML = `${Math.round(tempCelsius)}°C`;
  } else {
    const tempFahrenheit = (tempCelsius * 9/5) + 32;
    document.getElementById("temp").innerHTML = `${Math.round(tempFahrenheit)}°F`;
  }
};

// Event listener for search button
searchBtn.addEventListener("click", () => {
  getWeather(searchBox.value);
});

// Toggle button functionality
const toggleButton = document.getElementById("toggle-button");
toggleButton.addEventListener("click", () => {
  isCelsius = !isCelsius;
  updateTemperature();
  toggleButton.innerHTML = isCelsius ? "Show in °F" : "Show in °C";
});
