var express = require('express');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var cheerio = require('cheerio');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
  	title: ''
  });
});

router.get('/confirm/', function(req, res, next) {
	var _url = req.param('url');

	var imageSearchURL = 'https://www.google.com/searchbyimage?hl=en&image_url='+ _url;
	
	var data = null;
	var response = 'test';

	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;

	xhr.addEventListener("readystatechange", function () {
	  if (this.readyState === this.DONE) {
	    //console.log(this.responseText);
	    response = this.responseText;
	    response = response.substring(response.indexOf('<a class="_gUb"'));
	    response = response.substring(response.indexOf('>') + 1);
	    response = response.substring(0, response.indexOf("</a>"));
	    console.log(response);

	    var displayLocation = response;

	    res.render('confirm', {
			title: 'AeroSearch',
			location: displayLocation
		});
	  }
	});

	xhr.open("GET", imageSearchURL);
	xhr.setRequestHeader("cache-control", "no-cache");
	xhr.setRequestHeader("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.97 Safari/537.11");
	xhr.setRequestHeader("postman-token", "aa4253b1-8ae5-636c-669e-673e6cdfde39");

	xhr.send(data);

	
});

router.get('/result/', function(req, res, next) {
	var _originatingCity = req.param('ori');
	var _destinationCity = req.param('des');

	var data = null;

	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;

	xhr.addEventListener("readystatechange", function () {
	  if (this.readyState === this.DONE) {
	    //console.log(this.responseText);
	    var airportName = this.responseText;
	    airportName = airportName.substring(airportName.indexOf('name') + 7);
	    airportName = airportName.substring(0, airportName.indexOf('"'));
	    //console.log(airportName);
	    var airportCode = this.responseText;
	    airportCode = airportCode.substring(airportCode.indexOf('code') + 7);
	    airportCode = airportCode.substring(0, airportCode.indexOf('"'));
	    _originatingCity = airportName + ' (' + airportCode + ')';
	  }
	});

	xhr.open("GET", "https://airport.api.aero/airport/nearest/37.777169799999996/-122.41839970000001?user_key=18735d2ae0309dddbc46f1ff985ba37a");
	xhr.setRequestHeader("cache-control", "no-cache");
	xhr.setRequestHeader("postman-token", "d1292734-49e3-dc53-71fd-65535b06dc74");

	xhr.send(data);

	var _destAirport = "-99";
	
	//api call that returns the data we want
	var http = require("https");

	var options = {
		"method": "GET",
		"hostname": "maps.googleapis.com",
		"port": null,
		"path": "/maps/api/place/textsearch/json?query="+encodeURIComponent(_destinationCity)+"&key=AIzaSyC8RRZ6l3rBJ43DunaYkX2Xw7yawB0tlDE"
	};
	
	var request = http.request(options, function (response) {
		var chunks = [];
	
		response.on("data", function (chunk) {
			chunks.push(chunk);
		});
	
		response.on("end", function () {
			var body = Buffer.concat(chunks);
			_destAirport = body.toString();
			_destAirport = _destAirport.substring(_destAirport.indexOf('lat') + 7);
			var _destAirportLat = _destAirport.substring(0, _destAirport.indexOf(','));
			_destAirport = _destAirport.substring(_destAirport.indexOf('lng') + 7);
			var _destAirportLng = _destAirport.substring(0, _destAirport.indexOf('}'));
			// cityName = cityName.substring(cityName.indexOf('"'));
			// cityName = cityName.substring(cityName.indexOf('"') + 1);
			// cityName = cityName.substring(cityName.indexOf('"') + 1);
			// var fullName = cityName.substring(0, cityName.indexOf('"'));
			// cityName = cityName.substring(0, cityName.indexOf(","));

			// _destinationCity = cityName;

			var data = null;

			var xhr = new XMLHttpRequest();
			xhr.withCredentials = true;

			xhr.addEventListener("readystatechange", function () {
			  if (this.readyState === this.DONE) {
			    //console.log(this.responseText);
			    var airportName = this.responseText;
			    airportName = airportName.substring(airportName.indexOf('name') + 7);
			    airportName = airportName.substring(0, airportName.indexOf('"'));
			    console.log(airportName);
			    var airportCode = this.responseText;
			    airportCode = airportCode.substring(airportCode.indexOf('code') + 7);
			    airportCode = airportCode.substring(0, airportCode.indexOf('"'));
			    _destAirport = airportName + ' (' + airportCode + ')';
			    console.log(_destAirport);

				res.render('result', {
				title: 'AeroSearch',
				originating: _originatingCity,
				destination: _destAirport
				});
			  }
			});

			xhr.open("GET", "https://airport.api.aero/airport/nearest/" + _destAirportLat + "/" + _destAirportLng + "?user_key=18735d2ae0309dddbc46f1ff985ba37a");
			xhr.setRequestHeader("cache-control", "no-cache");
			xhr.setRequestHeader("postman-token", "d1292734-49e3-dc53-71fd-65535b06dc74");

			xhr.send(data);
		});
	});

	request.end();

	
});

module.exports = router;