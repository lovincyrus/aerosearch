var express = require('express');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var cheerio = require('cheerio');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
  	title: 'Sign In to AeroFS'
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

	    var displayLocation = response + '?';

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

module.exports = router;