var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
  	title: ''
  });
});

/* GET home page. */
router.get('/payment', function(req, res, next) {
  res.render('checkout', {
  	title: 'Stripe Checkout Form'
  });
});

module.exports = router;