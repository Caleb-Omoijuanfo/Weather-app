
"use strict";
const app = document.getElementById("weather");
const weatherIcon = document.getElementById("weatherIcon")
const weatherState = document.getElementById("weatherState")
const weatherTemp = document.getElementById("weatherTemp")
const weatherDescription = document.getElementById('weatherDescription')
const newState = document.getElementById('newState');


// ----------------------------------------------------------------------------
//PAGE LOADER
function loader(){
  let loader = document.getElementById('loader');
  loader.style.display = "none";
  app.style.display = "block";
}

function setLoader(){
  setTimeout(loader(), 3000);
}


// ----------------------------------------------------------------------------
//FORM CONTROL
let form = document.querySelector('form');
form.addEventListener('submit', (event) => {
  changeLocation(form.elements.inputValue.value);
  event.preventDefault();
  //clear input field after clicking submit
  form.elements.inputValue.value = "";
})


// ----------------------------------------------------------------------------
//DISPLAY WEATHER DETAILS
function showWeather(latitude, longitude){
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}35&lon=${longitude}&APPID=aa03c05def126fd3d1626d1ed445ef91&units=metric`;

  fetch(url)
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    //console.log(JSON.stringify(myJson));

    let temperature = document.createElement("h1");
    temperature.innerHTML = `${myJson.main.temp}°C`;

    let state = document.createElement("p");
    state.innerHTML = `${myJson.name}, ${myJson.sys.country}`;

    let description = document.createElement("p");
    description.innerHTML = myJson.weather[0].description;

    let iconContainer = document.createElement("p");
    let icon = document.createElement("img");
    icon.src = `http://openweathermap.org/img/wn/${myJson.weather[0].icon}@2x.png`;

    app.appendChild(weatherIcon);
    app.appendChild(weatherDescription);
    app.appendChild(weatherState);
    app.appendChild(weatherTemp);
    weatherIcon.appendChild(iconContainer);
    iconContainer.appendChild(icon);
    weatherDescription.appendChild(description);
    weatherState.appendChild(state);
    weatherTemp.appendChild(temperature);

  });

}

// ----------------------------------------------------------------------------
//CHANGE LOCATION USING STATE
function changeLocation(city){
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city},ng&APPID=aa03c05def126fd3d1626d1ed445ef91&units=metric`;

  fetch(url)
  .then(function(response) {
    if(response.status != 200){
      alert("State does not exist");
      return;
    }

    //Examine the text in the response
    response.json().then(function(myJson) {
      //Remove old weather and replace with new ones.
      weatherTemp.removeChild(weatherTemp.firstChild);
      weatherState.removeChild(weatherState.firstChild);
      weatherDescription.removeChild(weatherDescription.firstChild);
      weatherIcon.removeChild(weatherIcon.firstChild);

      let temperature = document.createElement("h1");
      temperature.innerHTML = `${myJson.main.temp}°C`;

      let state = document.createElement("p");
      state.innerHTML = `${myJson.name}, ${myJson.sys.country}`;

      let description = document.createElement("p");
      description.innerHTML = myJson.weather[0].description;

      let iconContainer = document.createElement("p");
      let icon = document.createElement("img");
      icon.src = `http://openweathermap.org/img/wn/${myJson.weather[0].icon}@2x.png`;

      app.appendChild(weatherIcon);
      app.appendChild(weatherDescription);
      app.appendChild(weatherState);
      app.appendChild(weatherTemp);
      weatherIcon.appendChild(iconContainer);
      iconContainer.appendChild(icon);
      weatherDescription.appendChild(description);
      weatherState.appendChild(state);
      weatherTemp.appendChild(temperature);

    });
  }
)
.catch(function(err) {
  //console.log('Fetch Error :-S', err);
});

}

// ----------------------------------------------------------------------------
//FUNCTION TO DISPLAY THE ACTUAL ERROR AND NOT JUST THE ERROR CODE.
function codeConverter (code) {
  let errorCodes = ["unknown error", "permission denied", "position unavailable", "timed out"];

  for (let errorCode of errorCodes ){
    if(code === errorCodes.indexOf(errorCode)){
      return errorCodes[errorCodes.indexOf(errorCode)];
    }
  }
};


// ----------------------------------------------------------------------------
// check for Geolocation support
if (navigator.geolocation) {
  //Function executes when the Browser is lunched or refreshed.
  window.onload = function() {
    var startPos;
    var geoSuccess = function(position) {
      startPos = position;

      let lat = startPos.coords.latitude;
      let long = startPos.coords.longitude;

      setLoader();
      showWeather(lat, long);

    };

    var geoError = function(error) {

      alert(`Error occurred. Error code: ${error.code} - ${codeConverter(error.code)}`);
      // error.code can be:
      //   0: unknown error
      //   1: permission denied
      //   2: position unavailable (error response from location provider)
      //   3: timed out
    };
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
  };
}
else {
  alert('Geolocation is not supported for this Browser/OS.');
}
