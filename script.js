const apiKeyWeather = "3e16e32ceee02973c525698b26376c5b";
const x = [...document.querySelectorAll(".day")];
const z = [...document.querySelectorAll(".dayDetails")];
const press = document.querySelector('input')
const icon = document.querySelector('.cityName i')
const weekday = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];
let weekdaySchedule = [];
let citySearched;
let cityData;
let weatherData;



//API
async function getCityLatLon() {
  const response = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=1&namePrefix=${citySearched}`, {
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
      "x-rapidapi-key": "f4a11bf4cbmsh5b92adb0e60713cp1d13b1jsn9bba4dd46055"
    }
  })
  cityData = await response.json();
  

}

async function getWeather() {
  const response = await fetch(
    `http://api.openweathermap.org/data/2.5/onecall?lat=${cityData.data[0].latitude}&lon=${cityData.data[0].longitude}&exclude=current,hourly,minutely,alerts&units=metric&appid=${apiKeyWeather}`
  );
  let data = await response.json();
  weatherData = data.daily

}
//API

const cityDetails = document.querySelector('.fetchedCityDetails')
const flag =document.querySelector('.cntFlag')
const cityTab = document.querySelector('.cityTab')
const dayTabs= document.querySelector('.dayTabs')
const cityInfo = document.querySelector('.cityInfo')
const errorTab = document.querySelector('.errorTabOff')
let newtable=[];

setTodayDate()
setDaysOrder()
setWeather()


citySearched =
  press.addEventListener('input', () => {    
    icon.classList.value = "fas fa-check-circle"
  })

icon.addEventListener('click', () => {
  citySearched = document.querySelector('input').value
  console.log(citySearched)
  getCityLatLon()
  
  setTimeout(()=> {if(cityData.data.length == 0){
    errorTab.classList.value = 'errorTabOn'
    setTimeout(()=> {
      errorTab.classList.value = 'errorTabOff'
      press.value = ""
      icon.classList.value = "fas fa-map-marker-alt"
      press.focus()
    }, 800)
  } else { 
  cityTab.classList.value = 'cityTabChanged'
  cityInfo.classList.value = 'cityInfoChanged'
  setTimeout(() => {  
  cityDetails.innerHTML = `
            <span class="">${displayName(cityData.data[0].city)}</span>
            <span class="">${displayName(cityData.data[0].country)}</span>
            <span class="">${cityData.data[0].latitude.toFixed(2)}</span>
            <span class="">${cityData.data[0].longitude.toFixed(2)}</span>
  `
flag.innerHTML =`
<img src="https://www.countryflags.io/${cityData.data[0].countryCode}/shiny/64.png">
`
  }, 800)
}}, 500)

setTimeout(getWeather, 400)

setTimeout(weatherValues, 1000)
setTimeout(daysUpdate, 1000)
})


x.forEach((item, index) => {
  item.addEventListener("click", () => {
    if (isHidden() == true) {
      rollDown(index);
    } else {
      if (z[index].style.visibility == "visible") {
        rollUp();
      } else {
        rollUp();
        setTimeout(() => {
          rollDown(index);
        }, 700)
      }
    }
  });
});

function rollDown(index) {
  console.log("rollDown");
  z[index].style.visibility = "visible";
  z[index].style.height = "200px";
  setTimeout(() => { z[index].style.color = 'white'; }, 400);

}

function rollUp() {
  z.forEach((item) => {
    item.style.color = '#1D4277';
    setTimeout(() => {
      item.style.visibility = "hidden";
      item.style.height = "0";
    }, 400)

    console.log("rollUp");
  });
}

function isHidden() {
  let checkArray = [];
  z.forEach((item) => {
    checkArray.push(item.style.visibility);
  });
  console.log(checkArray);
  function checkVisible(value) {
    return value == "visible";
  }

  let checkedArray = checkArray.filter(checkVisible);
  console.log(checkedArray);

  return checkedArray.length < 1;
}

function setDaysOrder() {
  let date = new Date()
  let dayNumber = date.getDay()
  let weekdayUpdate = []

  weekdayUpdate.push(dayNumber)
  for (i = 0; i < 7; i++) {
    dayNumber++
    if (dayNumber < 7) {
      weekdayUpdate.push(dayNumber)
    }
    else {
      dayNumber = 0
      weekdayUpdate.push(dayNumber)
    }
  }
  weekdayUpdate.forEach((item, index) => {
    let dayName = weekday[item]

    weekdaySchedule.push(dayName)

  })
}

function daysUpdate() {
  x.forEach((item, index) => {
    item.querySelector('h2').textContent = newtable[index].name
    item.children[2].innerHTML = `${Math.round(newtable[index].day)}<sup class="degC">&#8451;</sup>`
  })
  z.forEach((item, index) => {
    item.querySelector('.dayInfoEveningValue').textContent = 
    newtable[index].eve
    item.querySelector('.dayInfoMorningValue').textContent = 
    newtable[index].mor
    item.querySelector('.dayInfoNightValue').textContent = 
    newtable[index].night
    item.querySelector('.dayInfoHumdityValue').textContent = 
    newtable[index].hum

  })
}

function setTodayDate() {
  let todayDate = document.querySelector('.todayDate')
  let fullDate = new Date()
  let day = fullDate.getDate()
  let month = months[fullDate.getMonth()]
  let year = fullDate.getFullYear()
  todayDate.textContent = `${day} ${month.toUpperCase()} ${year}`

}

function displayName(name){
  
  if(name.length >=13){
    name = name.replace(/[a-z]/g,'')
  } 
  
  return name
}

function setWeather(){
  newtable = weekdaySchedule.map((item)=>{
     item = {
      name: item,
      day:"",
      eve:"",
      mor:"",
      night:"",
      hum:"",
      cond:""
 
      
    }
  return item;
  })

  
  }

  function weatherValues(){
    newtable.forEach((item, index)=>{
       item.day = weatherData[index].temp.day
       item.eve = weatherData[index].temp.eve
       item.mor = weatherData[index].temp.morn
       item.night = weatherData[index].temp.night
       item.hum = weatherData[index].humidity
    })
  }
