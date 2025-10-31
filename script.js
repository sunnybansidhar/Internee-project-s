const apiKey = "e28454c6ee730efef5884f9fa0f32723";

const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const cityInput = document.getElementById("cityInput");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const condition = document.getElementById("condition");
const weatherIcon = document.getElementById("weatherIcon");
const errorMsg = document.getElementById("error");

const appBg = document.body;

// ✅ Fetch weather by city name
async function getWeather(city) {
  try {
    errorMsg.textContent = "";
    weatherIcon.style.display = "none"; // hide old icon before search

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    errorMsg.textContent = "❌ City not found. Please try again.";
    cityName.textContent = "";
    temperature.textContent = "";
    humidity.textContent = "";
    condition.textContent = "";
    weatherIcon.src = "";
    weatherIcon.style.display = "none";
  }
}

// ✅ Display weather data
function displayWeather(data) {
  const temp = data.main.temp;
  const humid = data.main.humidity;
  const desc = data.weather[0].main;
  const iconCode = data.weather[0].icon;

  cityName.textContent = data.name;
  temperature.textContent = `🌡️ Temperature: ${temp}°C`;
  humidity.textContent = `💧 Humidity: ${humid}%`;
  condition.textContent = `🌥️ Condition: ${desc}`;

  // ✅ Proper Weather Icon URL
  weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  weatherIcon.alt = desc;
  weatherIcon.style.display = "block"; // show icon after loading

  // 🔄 Background change based on weather
  if (desc.includes("Cloud")) {
    appBg.style.background = "linear-gradient(135deg, #bdc3c7, #2c3e50)";
  } else if (desc.includes("Rain")) {
    appBg.style.background = "linear-gradient(135deg, #667db6, #0082c8, #0082c8, #667db6)";
  } else if (desc.includes("Clear")) {
    appBg.style.background = "linear-gradient(135deg, #f6d365, #fda085)";
  } else {
    appBg.style.background = "linear-gradient(135deg, #74ebd5, #acb6e5)";
  }
}

// ✅ Current Location Weather
locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success => {
      const { latitude, longitude } = success.coords;
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      )
        .then(res => res.json())
        .then(data => displayWeather(data))
        .catch(() => {
          errorMsg.textContent = "⚠️ Unable to fetch location weather.";
        });
    });
  } else {
    errorMsg.textContent = "⚠️ Geolocation not supported in this browser.";
  }
});

// ✅ Search Button Click
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) getWeather(city);
  else errorMsg.textContent = "Please enter a city name!";
});
