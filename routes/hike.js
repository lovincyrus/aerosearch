var uuid = require('node-uuid');

exports.index = function(req, res) {
	res.app.get('connection').query('SELECT * FROM HIKES', function(err, rows) {
		if (err) {
			res.send(err);
		} else {
			res.render('hike', {	// render the hike.jade file
				hikes: rows	// with the following parameters
			});
		}
	});
};

exports.add_hike = function(req, res) {
	var new_hike = {
		HIKE_DATE: new Date(),
		ID: uuid.v4(),
		NAME: req.body.name,
		LOCATION: req.body.location,
		DISTANCE: req.body.distance,
		WEATHER: req.body.weather
	};

	req.app.get('connection').query('INSERT INTO HIKES set ?', new_hike, function(err) {
		if (err) {
			res.send(err);
		} else {
			res.redirect('/hikes');
		}
	});
};
