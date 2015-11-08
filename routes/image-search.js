var express = require('express');
var router = express.Router();
/*
function getKeyword(url){
	var keyword = "-99";
	
	
	
	return keyword;
}
*/
/* GET home page. */
router.get('/aerosearch', function(req, res, next) {
	var imageURL = req.body.url;
	//var keyword = getKeyword(imageURL);
	
	
	
  res.render('index', {
  	title: ''
  });
});

module.exports = router;