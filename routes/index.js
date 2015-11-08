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

	var cityName = "-99";
	
	//api call that returns the data we want
	var http = require("https");

	var options = {
		"method": "GET",
		"hostname": "maps.googleapis.com",
		"port": null,
		"path": "/maps/api/place/textsearch/json?query="+encodeURIComponent(_destinationCity)+"&key=AIzaSyCMtSm2QTM05-gUB3IrNfp5lk9L_u5cjKY"
	};
	
	var request = http.request(options, function (response) {
		var chunks = [];
	
		response.on("data", function (chunk) {
			chunks.push(chunk);
		});
	
		response.on("end", function () {
			var body = Buffer.concat(chunks);
			cityName = body.toString();
			cityName = cityName.substring(cityName.indexOf('formatted_address'));
			cityName = cityName.substring(cityName.indexOf('"'));
			cityName = cityName.substring(cityName.indexOf('"') + 1);
			cityName = cityName.substring(cityName.indexOf('"') + 1);
			var fullName = cityName.substring(0, cityName.indexOf('"'));
			cityName = cityName.substring(0, cityName.indexOf(","));

			console.log(cityName);

			_destinationCity = cityName;

			res.render('result', {
			title: 'AeroSearch',
			originating: _originatingCity,
			destination: _destinationCity
	});
		});
	});

	request.end();

	
});

module.exports = router;