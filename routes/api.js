/*
 * Serve JSON to our AngularJS client
 */

var locationLog = require("../models/Location").LocationModel;
var LocationService = new locationLog();
exports.locations = function (req, res) {
  LocationService.GetLocations(function(err, locations){
  	res.json(locations);
  });
};

exports.addLocation = function(req,res){
	var realBody = JSON.parse(Object.keys(req.body)[0].replace('\\n', '');
	LocationService.AddLocation(realBody, function(err){
		res.json(err);
	})
}