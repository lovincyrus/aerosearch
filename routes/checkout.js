// Set version
var express = require('express');
var router = express.Router();


var stripe = require("stripe")("sk_test_4IFhPhgE6X0HGXXYt1dP54TP");
stripe.setApiVersion('2015-10-16');



/**

Making your First Charge
Can charge customer's credit card using Checkout or Stripe.js
->> 

**/


// Set your secret key: remember to change this to your live secret key in production
// See your keys here https://dashboard.stripe.com/account/apikeys
//var stripe = require("stripe")("sk_test_4IFhPhgE6X0HGXXYt1dP54TP");

// (Assuming you're using express - expressjs.com)
// Get the credit card details submitted by the form
var stripeToken;

router.get('/submit', function(req, res, next) {
	stripeToken = request.body.stripeToken;
});



var charge = stripe.charges.create({
  amount: 1000, // amount in cents, again
  currency: "usd",
  source: stripeToken,
  description: "Example charge"
}, function(err, charge) {
  if (err && err.type === 'StripeCardError') {
    // The card has been declined
  }
});