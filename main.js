"use strict";
const app = document.getElementById("app");
const weatherIcon = document.getElementById("weatherIcon")
const weatherState = document.getElementById("weatherState")
const weatherTemp = document.getElementById("weatherTemp")
const weatherDescription = document.getElementById('weatherDescription')
const newState = document.getElementById('newState');

//FUNCTIONS
//
//

//DISPLAY WEATHER DETAILS
function showWeather(latitude, longitude){
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}35&lon=${longitude}&APPID=aa03c05def126fd3d1626d1ed445ef91&units=metric`;

  fetch(url)
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    console.log(JSON.stringify(myJson));

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

function changeLocation() {
  let form = document.createElement('form');

  let inputGroup = document.createElement('div');
  inputGroup.setAttribute('class', 'input-group');
  inputGroup.class = "mb-3";

  let input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.class = "form-control";
  input.placeholder = "Enter State";

  let inputGroupAppend = document.createElement('input-group-append');

  let span = document.createElement('span');
  span.class = "input-group-text";
  span.id = "basic-addon2";
  span.innerHTML = 'Submit';

  app.appendChild(newState);
  newState.appendChild(form);
  form.appendChild(inputGroup);
  inputGroup.appendChild(inputGroupAppend);
  inputGroup.appendChild(input);
  inputGroupAppend.appendChild(span);
}

//FUNCTION TO DISPLAY THE ACTUAL ERROR AND NOT JUST THE ERROR CODE.
function codeConverter (code) {
  let errorCodes = ["unknown error", "permission denied", "position unavailable", "timed out"];

  for (let errorCode of errorCodes ){
    if(code === errorCodes.indexOf(errorCode)){
      return errorCodes[errorCodes.indexOf(errorCode)];
    }
  }
};

// check for Geolocation support
if (navigator.geolocation) {
  //Function executes when the Browser is lunched or refreshed.
  window.onload = function() {
    var startPos;
    var geoSuccess = function(position) {
      startPos = position;

      let lat = startPos.coords.latitude;
      let long = startPos.coords.longitude;

      showWeather(lat, long);
      //changeLocation();
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
