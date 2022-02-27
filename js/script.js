var currentWeatherEl = document.querySelector("#current-weather");
var fiveDayEl = document.querySelector("#five-day");
var cityContEl = document.querySelector("#city-container");
var searchBarEl = document.querySelector("#city");
var searchForm = document.querySelector("#find-city");

function formSubmitHandler(event){
    event.preventDefault();
    var citySearch = searchBarEl.value.trim();
    localStorage.setItem("city", JSON.stringify(citySearch));

    if(citySearch){
        getCity(citySearch);
        searchBarEl.value = "";
        //dynamically create <a> using getItem value
        //cityContEl.appendChild();
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
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat +"&lon="+ long +"&appid=d465004d10a4822000d10942c7287cc9"
    
    fetch(apiUrl).then(function (response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data);
                /*TO DO:
                find out how to convert UNIX to UTC in my code
                declare variables for data to be passed to displayCurrent
                declare variables for data to be passed to displayFive
                possibly use the same api but different fetch request to avoid confusion
                dynamically create elements using hard coded placeholders
                find out how to display icons correctly, do I need additional sheets?
                */



            });
        }else{
            alert("Error, unable to locate city")
        }
    })
    .catch(function(error){
        alert("Unable to locate weather data")
    });
    
};

function displayCurrent(city, date, temp, wind, humidity, uvIndex){

};

function displayFive(date, icon, temp, wind, humidity){

};


searchForm.addEventListener("submit", formSubmitHandler);

// fetch from search bar; formSubmitHandler, getUserRepos
// fetch from previous searches, limit 10; see buttonClickHandler
// populate current values
// populate 5 day forecast values