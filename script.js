const API_KEY = "c9255a4f46e710d9fceb1fb160331479";
const cityName = document.querySelector(".city");
const countryImage = document.querySelector(".country-image");
const desc = document.querySelector("[data-description]");
const weatherIcon = document.querySelector("[data-weatherIcon]");
const weatherTemp = document.querySelector("[data-temperature]");
const windSpeed = document.querySelector("[data-windSpeed]");
const weatherHumidity = document.querySelector("[data-humidity]");
const weatherCloud = document.querySelector("[data-cloud]");
const renderContainer = document.querySelector(".container");
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const searchCity = document.querySelector("[data-searchCity]");
const inputCity = document.querySelector("[data-inputCity]");
const dataButton = document.querySelector("[data-button]");
const input = document.querySelector('input');
const grantAccess = document.querySelector('[data-grantAccess]');
const grantAccessButton = document.querySelector('[data-getAccessBtn]');
const cityNotFound = document.querySelector('[data-notFound]');
const loadingIndicator = document.querySelector('[data-loadingImage]');

// getLocation();
grantAccess.classList.remove("nonactive");
renderContainer.classList.add("nonactive");
// getfromSessionStorage();

grantAccessButton.addEventListener('click', () => {
  getLocation();
})

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  console.log(latitude, longitude);

  const userCoordinates = {
    lat: latitude,
    lon: longitude,
  };
  sessionStorage.setItem('user-coordinates',JSON.stringify(userCoordinates));

  getLocationDetails(latitude, longitude);
}

async function getLocationDetails(latitude, longitude) {
  try {
    loadingIndicator.classList.remove("nonactive");
    const result = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    const data = await result.json();
    console.log(data);
    loadingIndicator.classList.add("nonactive");
    renderWeatherInfo(data);
    renderContainer.classList.remove("nonactive");
    grantAccess.classList.add("nonactive");
  } catch (err) {
    console.log("Error: " + err.message);
  }
}

function renderWeatherInfo(data) {
  cityName.innerHTML = `${data?.name}`;
  countryImage.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
  desc.innerHTML = `${data?.weather?.[0]?.main}`;
  weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
  weatherTemp.innerHTML = `${data?.main?.temp.toFixed(2)} °C`;
  windSpeed.innerHTML = `${data?.wind?.speed.toFixed(2)}m/s`;
  weatherHumidity.innerHTML = `${data?.main?.humidity}%`;
  weatherCloud.innerHTML = `${data?.clouds?.all}%`;
}

searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});

userTab.addEventListener("click", () => {
  switchTab(userTab);
});

searchCity.classList.add("nonactive");

function switchTab(clickedTab) {
  if (clickedTab === searchTab) {
    searchTab.classList.add("current-tab");
    userTab.classList.remove("current-tab");
    renderContainer.classList.add("nonactive");
    searchCity.classList.remove("nonactive");
    grantAccess.classList.add("nonactive");
    cityNotFound.classList.add("nonactive");
  }

  if (clickedTab === userTab) {
    userTab.classList.add("current-tab");
    searchTab.classList.remove("current-tab");
    // renderContainer.classList.remove("nonactive");
    searchCity.classList.add("nonactive");
    // getLocation();
    getfromSessionStorage();
  }
}

function getfromSessionStorage() {
  const localCoordinates = sessionStorage.getItem('user-coordinates');
  if(!localCoordinates){
    grantAccess.classList.add("active");
  }
  else{
    const coordinates = JSON.parse(localCoordinates);
    console.log(coordinates);
    const {lat, lon} = coordinates;
    getLocationDetails(lat, lon);
  }
}

// dataButton.addEventListener("click", () => {
//   getLocationDetailsByCity();
// });

input.addEventListener('keyup', (e) => {
  if(e.keyCode === 13){
    console.log(e.target.value);
    getLocationDetailsByCity(e.target.value);
  }
});

async function getLocationDetailsByCity(city) {
  if (inputCity.value === "") {
    return;
  }
  try {
    console.log(inputCity.value);
    loadingIndicator.classList.remove("nonactive");
    const result = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${inputCity.value}&appid=${API_KEY}&units=metric`
    );
    const data = await result.json();
    console.log(data);

    if(`${data?.cod}` !== "404"){
      cityNotFound.classList.add("nonactive");
      loadingIndicator.classList.add("nonactive");
      renderWeatherInfo(data);
      renderContainer.classList.remove("nonactive");
      renderContainer.classList.add("margin-down");
      inputCity.value = null;
    }
    else{
      loadingIndicator.classList.add("nonactive");
      cityNotFound.classList.remove("nonactive");
      renderContainer.classList.add("nonactive");
    }

  } catch (err) {
    console.log("Error: " + err.message);
  }
}

