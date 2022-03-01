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
                console.log(data)
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
    
};

function displayFive(fiveDayArray){
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
        tempEl.textContent = tempHigh +" - "+ tempLow;

        var windEl = document.createElement("p");
        windEl.textContent = wind;

        var humEl = document.createElement("p");
        humEl.textContent = humidity;

        fiveBlock.appendChild(dateEl);
        fiveBlock.appendChild(iconEl);
        fiveBlock.appendChild(tempEl);
        fiveBlock.appendChild(windEl);
        fiveBlock.appendChild(humEl);
        
        fiveDayEl.appendChild(fiveBlock);


    }
//date, icon, temp, wind, humidity
};


searchForm.addEventListener("submit", formSubmitHandler);
cityContEl.addEventListener("click", (e)=>
    getCity(e.target.textContent));

// fetch from search bar; formSubmitHandler, getUserRepos
// fetch from previous searches, limit 10; see buttonClickHandler
// populate current values
// populate 5 day forecast values