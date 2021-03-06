const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()

const apiKey = '78a53183008a0e2063f389a5991ed576';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
	res.render('index', {weather: null, error: null});
})

app.post('/', function (req, res) {
	let city = req.body.city;
	let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

	request(url, function (err, response, body) {
		if(err){
			res.render('index', {weather: null, error: 'Error, please try again'});
		} else {
			let weather = JSON.parse(body)
			if(weather.main == undefined){
				res.render('index', {weather: null, error: `Error searching for ${city}, please try again`});
			} else {
				let title = `${weather.name} Weather`;
				let weatherText = `Temperature: ${weather.main.temp}`+'\u2109';
				let low = `Low: ${weather.main.temp_min}`+'\u2109';
				let high = `High: ${weather.main.temp_max}`+'\u2109';
				let humidity = `Humidity: ${weather.main.humidity}%`;
				let wind = `Wind Speed: ${weather.wind.speed} mph`;
				res.render('index', {title: title, weather: weatherText, low: low, high: high, humidity: humidity, wind: wind, error: null});
			}
		}
	});
})

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function () {
	console.log('Weather app listening on port ', app.get('port'))
})