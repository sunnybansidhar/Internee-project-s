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
    weatherIcon.style.display = "none";

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    showError("❌ City not found. Please try again.");
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

  weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  weatherIcon.alt = desc;
  weatherIcon.style.display = "block";

  changeBackground(desc);
}

// ✅ Change background color based on weather
function changeBackground(desc) {
  if (desc.includes("Cloud")) {
    appBg.style.background = "linear-gradient(135deg, #bdc3c7, #2c3e50)";
  } else if (desc.includes("Rain")) {
    appBg.style.background = "linear-gradient(135deg, #667db6, #0082c8, #667db6)";
  } else if (desc.includes("Clear")) {
    appBg.style.background = "linear-gradient(135deg, #f6d365, #fda085)";
  } else {
    appBg.style.background = "linear-gradient(135deg, #74ebd5, #acb6e5)";
  }
}

// ✅ Show error and clear old data
function showError(msg) {
  errorMsg.textContent = msg;
  cityName.textContent = "";
  temperature.textContent = "";
  humidity.textContent = "";
  condition.textContent = "";
  weatherIcon.src = "";
  weatherIcon.style.display = "none";
}

// ✅ Current Location Weather
locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        )
          .then((res) => res.json())
          .then((data) => displayWeather(data))
          .catch(() => showError("⚠️ Unable to fetch location weather."));
      },
      () => showError("⚠️ Permission denied for location.")
    );
  } else {
    showError("⚠️ Geolocation not supported in this browser.");
  }
});

// ✅ Search Button Click
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) getWeather(city);
  else showError("Please enter a city name!");
});
