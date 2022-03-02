var currentWeatherEl = document.querySelector("#current-weather");
var fiveDayEl = document.querySelector("#five-day");
var cityContEl = document.querySelector("#city-container");
var searchBarEl = document.querySelector("#city");
var searchForm = document.querySelector("#find-city");

// if local storage items exist, use those, if none create fresh array
var searchArray = JSON.parse(localStorage.getItem("city")) || [];

for(let i=0; i<searchArray.length; i++){
    let newSearch = document.createElement("a");
    newSearch.setAttribute("class","list-item");
    newSearch.textContent = searchArray[i];
    
    cityContEl.appendChild(newSearch);
    
};

function formSubmitHandler(event){
    event.preventDefault();
    var citySearch = searchBarEl.value.trim();
    searchArray.push(citySearch);
    localStorage.setItem("city", JSON.stringify(searchArray));


    if(citySearch){
        getCity(citySearch);
        searchBarEl.value = "";
        //
    } else {
        alert("Please search for a city")
    }
};

function getCity(city){

    var apiUrl = "https://api.geoapify.com/v1/geocode/search?text="+ city +"&filter=countrycode:us&apiKey=01eed050df0d4d089a343250cd85c77f";
    
    fetch(apiUrl).then (function(response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data.query.text);
                localStorage.setItem("newGuy", JSON.stringify(data.query.text));
                var latValue = data.features[0].bbox[1];
                console.log(latValue);
                longValue = data.features[0].bbox[0];
                console.log(longValue);
                getWeather(latValue, longValue);
            });
        }else{
            alert(error);
        }
    })
    .catch(function(error){
        alert("City not found")
    });
};

function getWeather(lat, long){
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat +"&lon="+ long +"&units=imperial&appid=d465004d10a4822000d10942c7287cc9";
    
    fetch(apiUrl).then(function (response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data);
                var date = new Date (data.current.dt *1000);
                displayFive(data.daily);
                displayCurrent(data.current);

            });
        }else{
            alert("Error, unable to locate city")
        }
    })
    .catch(function(error){
        alert("Unable to locate weather data")
    });
    
};

function displayCurrent(currentObj){

    currentWeatherEl.innerHTML = "";


    var currDateEl = moment(currentObj.dt *1000).format("MM/DD/YYYY");
    var currNameEl = JSON.parse(localStorage.getItem("newGuy"));
    var currTempEl = currentObj.temp;
    var currWindEl = currentObj.wind_speed;
    var currHumEl = currentObj.humidity;
    var currUviEl = currentObj.uvi;
    var currIcon = "https://openweathermap.org/img/wn/" + currentObj.weather[0].icon + "@2x.png";


    
    var currentCityCont = document.createElement('div');
    currentCityCont.setAttribute("class", "flex-column col-7  m-3");

    var currentName = document.createElement('h3');
    currentName.textContent = currNameEl  + " " + currDateEl;

    var currentTemp = document.createElement('p');
    currentTemp.textContent = currTempEl + " °F";

    var currentWind = document.createElement('p');
    currentWind.textContent = "Wind Speed: " + currWindEl + "mph";


    var currentHumid = document.createElement('p');
    currentHumid.textContent = "Humidity: " + currHumEl + "%";


    var currentUv = document.createElement('p');
    currentUv.textContent = "UV Index: " + currUviEl;

    var iconHouse = document.createElement("div");
    iconHouse.setAttribute("class", "icon");

    var currIconEl = document.createElement('img');
    currIconEl.setAttribute("src", currIcon);

    
    currentCityCont.appendChild(currentName);
    currentCityCont.appendChild(currentTemp);
    currentCityCont.appendChild(currentWind);
    currentCityCont.appendChild(currentHumid);
    currentCityCont.appendChild(currentUv);
    
    iconHouse.appendChild(currIconEl);
    
    currentWeatherEl.appendChild(currentCityCont);
    currentWeatherEl.appendChild(iconHouse);
};

function displayFive(fiveDayArray){
    
    fiveDayEl.innerHTML = "";
    
    for(let i=0; i < 5; i++){
        var date = moment(fiveDayArray[i].dt *1000).format("MM/DD/YYYY");
        var icon = "http://openweathermap.org/img/wn/"+ fiveDayArray[i].weather[0].icon +"@2x.png";
        var tempHigh = fiveDayArray[i].temp.max;
        var tempLow =  fiveDayArray[i].temp.min;
        var wind = fiveDayArray[i].wind_speed;
        var humidity = fiveDayArray[i].humidity;

        var fiveBlock = document.createElement("div");
        fiveBlock.setAttribute("class","weather-block");

        var dateEl = document.createElement("h4")
        dateEl.textContent = date;

        var iconEl = document.createElement("img");
        iconEl.setAttribute("src",icon);

        var tempEl = document.createElement("p");
        tempEl.textContent = tempHigh + "°F - " + tempLow + " °F";

        var windEl = document.createElement("p");
        windEl.textContent = wind + "mph";

        var humEl = document.createElement("p");
        humEl.textContent = humidity + "%";

        fiveBlock.appendChild(dateEl);
        fiveBlock.appendChild(iconEl);
        fiveBlock.appendChild(tempEl);
        fiveBlock.appendChild(windEl);
        fiveBlock.appendChild(humEl);
        
        fiveDayEl.appendChild(fiveBlock);


    }

};


searchForm.addEventListener("submit", formSubmitHandler);
cityContEl.addEventListener("click", (e)=>
    getCity(e.target.textContent));