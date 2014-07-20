/*
 * Serve JSON to our AngularJS client
 */

 var PUBNUB = require("pubnub")
var pubnub = PUBNUB({
    publish_key   : "pub-c-acddd84b-6986-471f-8515-e6b8b23f59cb",
    subscribe_key : "sub-c-b240b038-0f7a-11e4-9284-02ee2ddab7fe",
    //cipher_key : "demo"
});
var EmergencyService = require("../services/EmergencyService");
var PoliceRecordService = require("../services/PoliceRecordService");

var locationLog = require("../models/Location").LocationModel;
var LocationService = new locationLog();
exports.locations = function (req, res) {
  LocationService.GetLocations(function(err, locations){
  	res.json(locations);
  });
};
EmergencyService.checkPerson();
exports.addLocation = function(req,res){
	console.log(req.body);
	var realBody = JSON.parse(Object.keys(req.body)[0].replace('\\n', '').replace("\\", '')).point;	
	console.log(realBody);
	LocationService.AddLocation(realBody, function(err){
		EmergencyService.checkPerson();
		PoliceRecordService.checkCoordinates(realBody);

		LocationService.GetLocations(function(err, locations){
			console.log("reporting new locations", locations);
	     	pubnub.publish({
         		channel: 'NewLocations',
         		message: locations
    		 });
		})
		
		res.json(err);
	})
}