'use strict';

//geolocation
function success(pos){
    ajaxRequest(pos.coords.latitude, pos.coords.longitude);
}

function fail(error){
    alert('Unable to gain location. error code:' + error.code);
}

navigator.geolocation.getCurrentPosition(success,fail);

//UTC to milli-seconds
function UTCToJSTime(utcTime){
    return utcTime * 1000;
}

//Get data
function ajaxRequest(lat,long){
    const url='https://api.openweathermap.org/data/2.5/forecast';
    const appId ='de97ad12502206556b2a5c768323bbb8';

    $.ajax({
        url: url,
        data: {
            appid:appId,
            lat: lat,
            lon: long,
            units: 'metric',
        }
    })
    .done(function(data){
        console.log(data);

        //city, country
        console.log('City: ' +  data.city.name);
        console.log('Country: ' + data.city.country);
        $('#place').text(data.city.name + ',' + data.city.country);

        //forecast data
        data.list.forEach(function(forecast, index){
            const dateTime= new Date(UTCToJSTime(forecast.dt));
            const month = dateTime.getMonth()+1;
            const date = dateTime.getDate();
            const hours = dateTime.getHours();
            const min = String(dateTime.getMinutes()).padStart(2,'0');
            const temperature = Math.round(forecast.main.temp);
            const description = forecast.weather[0].description;
            const iconPath = `${forecast.weather[0].icon}.svg`;

            //console.log('Date/time: '+ `${month}/${date} ${hours}:${min}`);
            //console.log('Temperature: ' + temperature);
            //console.log('Weather: ' + description);
            console.log('Image path: ' + iconPath)

            //Change output between the current weather and others
            if(index===0){
                const currentWeather =
                `<div class="icon"><img src="$(iconPath)"></div>
                <div class="info">
                <p>
                <span class="description">Current weather</span>
                <span class="temp">${temperature}</span>°C
                </p>
                </div>>`;
                $('#weather').html(currentWeather);
            } else {
                const tableRow = `
                <tr>
                <td class="info>
                ${month}/${date} ${hours}:${min} 
                </td>
                <td class="icon"><img src="${iconPath}"></td>
                <td><span class="description">${description}</span></td>
                <td><span class="temp">${temperature}°C</span></td>
                </tr>`;
                $('#forecast').append(tableRow);
          
            
            }
        })
    })
    .fail(function(){
        console.log('$.ajax failed!');
    })
}