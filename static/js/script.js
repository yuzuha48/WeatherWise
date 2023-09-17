var cookieElement = document.querySelector("#cookie");

function removeCookie() {
    cookieElement.remove();
}


function getCity(element) {
    document.querySelector(".city").textContent = element.innerText
}


function convertTemp(element) {
    tempList = document.querySelectorAll(".temperature")
    tempList.forEach(tempList => {
        var highTempString = tempList.querySelector(".high").textContent
        var lowTempString = tempList.querySelector(".low").textContent
        if(element.value == "°F") {
            var high = Math.round((parseInt(highTempString) * 9/5) + 32)
            var low = Math.round((parseInt(lowTempString) * 9/5) + 32)
        }
        else {
            var high = Math.round((parseInt(highTempString) - 32) * 5/9) 
            var low = Math.round((parseInt(lowTempString) -32 ) * 5/9)
        }
        tempList.querySelector(".high").textContent = high.toString() + "°"
        tempList.querySelector(".low").textContent = low.toString() + "°"
    }) 
}  


function getTemp(unit, temp) {
    if (unit.value == '°C') {
        var temperature = Math.round(temp - 273.15)
    }
    else if (unit.value == '°F') {
        var temperature = Math.round((temp - 273.15) * 1.8 + 32)
    }
    return temperature
} 


function getDayName(day_num) {
    if (day_num == 1) {
        var day_name = "Monday"
    }
    if (day_num == 2) {
        var day_name = "Tuesday"
    }
    if (day_num == 3) {
        var day_name = "Wednesday"
    }
    if (day_num == 4) {
        var day_name = "Thursday"
    }
    if (day_num == 5) {
        var day_name = "Friday"
    }
    if (day_num == 6) {
        var day_name = "Saturday"
    }
    if (day_num == 7) {
        var day_name = "Sunday"
    }   
    return day_name
}


function changeImage(image, weather) {
    if (weather == "Rain") {
        image.src = "static/assets/some_rain.png"
    }
    else if (weather == "Clouds") {
        image.src = "static/assets/some_clouds.png"
    }
    else if (weather == "Clear") {
        image.src = "static/assets/some_sun.png"
    }
    else {
        image.src = "static/assets/some_clouds.png"
    }
}


function updateVisual(element, high_temp, low_temp, weather) {
    element.querySelector(".high").textContent = high_temp.toString() + "°"
    element.querySelector(".low").textContent = low_temp.toString() + "°"

    var image = element.querySelector(".image")
    var description = element.querySelector(".description")

    changeImage(image, weather)
    description.textContent = weather.toLowerCase()
}


function currentWeather(data, unit) {
    var tempToday = document.querySelector('.today')

    var high = getTemp(unit, data["main"].temp_max)
    var low = getTemp(unit, data["main"].temp_min)

    updateVisual(tempToday, high, low, data["weather"][0].main)
}


function forecastWeather(data, unit) {
    var days = document.querySelectorAll('.day')

    for (let day=1; day<days.length; day++) {
        var current_date_obj = new Date()
        var next_date_time = current_date_obj.setDate(current_date_obj.getDate() + day);
        var next_date_time_obj = new Date(next_date_time)
        var next_date = next_date_time_obj.setHours(0,0,0,0)

        for (let j=0; j<data['list'].length; j++) {
            var api_date_obj = new Date(data['list'][j]['dt_txt'])
            var api_date = api_date_obj.setHours(0,0,0,0)

            if (api_date == next_date) {
                var high = getTemp(unit, data['list'][j]["main"].temp_max)
                var low = getTemp(unit, data['list'][j]["main"].temp_min)
                list_num = j
                break;
            }
        }

        var day_name_elem = days[day].querySelector("h3")
        if (day_name_elem.classList.contains('day_name')) {
            var day_num = next_date_time_obj.getDay()
            var day_name = getDayName(day_num)
            days[day].querySelector('.day_name').textContent = day_name
        }

        updateVisual(days[day], high, low, data['list'][list_num]["weather"][0].main) 
        //console.log(data['list'][list_num]["weather"][0].main)
    }
}


async function getWeather(lat, lon) {
    const [data1, data2] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=8e219f0cd017d8624876764c47790259`).then(res =>  res.json()),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=8e219f0cd017d8624876764c47790259`).then(res =>  res.json())
    ])

    console.log(data1)
    console.log(data2)

    var unit = document.querySelector(".selectTemp")
    currentWeather(data1, unit)
    forecastWeather(data2, unit)

}

getWeather(44.9778, -93.2650)



