var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
  	title: 'Sign In to AeroFS'
  });
});

module.exports = router;
