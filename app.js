var APPID = "3cc977a2dbe92cdfea7894b7eac62a83";
var temp;
var loc;
var icon;
var humidity;
var wind;
var direction;
var cityinput;


function update(weather) {
    icon.src = "imgs/codes/" + weather.code + ".png";
    //console.log(weather);
    humidity.innerHTML = weather.humidity;
    //wind.innerHTML = weather.wind;
    //direction.innerHTML = weather.direction;
    //loc.innerHTML = weather.location;
    temp.innerHTML = weather.temp;
}

function updateByLocation(location) {
    console.log(location);
    var url = "http://api.openweathermap.org/data/2.5/weather?q=" + location + "&APPID=" +
        APPID; //+ "&units=metric";
    sendRequest(url);
    
}

window.onload = function () {
    temp = document.getElementById("temperature");
    loc = document.getElementById("location");
    icon = document.getElementById("icon");
    humidity = document.getElementById("humidity");
    wind = document.getElementById("wind");
    direction = document.getElementById("direction");
    
    cityinput = document.getElementById("cityinput");
    cityform = document.getElementById("cityform");
    
    cityinput.addEventListener("change", function () {
        cityinput = document.getElementById("cityinput");
        updateByLocation(cityinput.value);
    }, false);
    
    cityform.addEventListener("submit", function (e) {
        e.preventDefault();
        cityinput = document.getElementById("cityinput");
        updateByLocation(cityinput.value);
    }, false);
    
    updateByLocation(cityinput.value);

    if(navigator.geolocation){
	var showPosition = function(position){
	    updateByGeo(position.coords.latitude, position.coords.longitude);
	}
	navigator.geolocation.getCurrentPosition(showPosition);
    } else {
	var zip = window.prompt("Could not discover your location. What is your zip code?");
	updateByZip(zip);
    }

}

function updateByGeo(lat, lon){
    var url = "http://api.openweathermap.org/data/2.5/weather?" +
	"lat=" + lat +
	"&lon=" + lon +
	"&APPID=" + APPID;
    sendRequest(url);    
}


function updateByZip(zip){
    var url = "http://api.openweathermap.org/data/2.5/weather?" +
	"zip=" + zip +
	"&APPID=" + APPID;
    sendRequest(url);
}


function sendRequest(url){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
	if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var data = JSON.parse(xmlhttp.responseText);
	    var weather = {};
        weather.icon = data.weather[0].id;
	    weather.code = data.weather[0].id;
	    weather.humidity = data.main.humidity;
	    weather.location = data.name;
	    weather.temp = K2C(data.main.temp);		
	    update(weather);
	}
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();    
}

function degreesToDirection(degrees){
    var range = 360/16;
    var low = 360 - range/2;
    var high = (low + range) % 360;
    var angles = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    for( i in angles ) {
	if(degrees >= low && degrees < high){
	    console.log(angles[i]);
	    return angles[i];
	    console.log("derp");
	}
	low = (low + range) % 360;
	high = (high + range) % 360;
    }
    return "N";
    
}

function K2F(k){
    return Math.round(k*(9/5)-459.67);
}

function K2C(k){
    return Math.round(k - 273.15);
}