const apiKey = "0a5aa13440037f77d676e0e53c0ee263";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector('.Search-box input');
const searchBtn = document.querySelector('.Search-box button');
const errorMessage = document.getElementById('error-message');
const weatherInfo = document.querySelector('.weather-info');

// Geolocation part
const show_detail = document.querySelector(".show_detail");
const full_address = document.querySelector(".full_address"); // Ensure it's correct
const address = document.querySelector(".address");

// Function to get user address by latitude and longitude
// API key and URL
const api_endpoint = "https://api.opencagedata.com/geocode/v1/json";
const api_key = "1e18d634cc314e21bc3d3c21a925cd0a";

let user_city = "";

const getUserAddress = async (latitude, longitude) => {
  // Use OpenCage Data API
  let query = `${latitude}, ${longitude}`;
  let api_url = `${api_endpoint}?key=${api_key}&q=${query}&pretty=1`;

  try {
    let res = await fetch(api_url);
    const data = await res.json();
    console.log(data);
    user_city = data.results[0].components.town;

    console.log(`here is the users users current city ${user_city}`)

  } catch (err) {
    console.log("Error using fetching OpenCage API");
    console.log(err);
  }
};

// Get user location
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    getUserAddress(latitude, longitude);
  }, (error) => {
    errorMessage.style.display = 'block';
    console.log(error.message);
    errorMessage.innerHTML = error.message;
  });
}

/*const getWeather = async (city) => {
  try {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    const data = await response.json();
    // Check if response is fine / city is valid
    if (response.ok) {
      errorMessage.style.display = 'none';
      weatherInfo.style.display = 'block';
      document.getElementById("city").innerHTML = data.name;
      document.getElementById("temp").innerHTML = Math.round(data.main.temp) + "°C";
      document.getElementById("humidity").innerHTML = data.main.humidity + "% humidity";
      document.getElementById("wind-speed").innerHTML = data.wind.speed + " km/h w-speed";
    } else {
      weatherInfo.style.display = 'none';
      errorMessage.style.display = 'block';
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};

searchBtn.addEventListener("click", () => {
  getWeather(searchBox.value);
});*/
