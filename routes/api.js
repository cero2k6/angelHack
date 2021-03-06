/*
 * Serve JSON to our AngularJS client
 */
var gm = require('googlemaps');
 var PUBNUB = require("pubnub");
 var request = require("request");
var pubnub = PUBNUB({
    publish_key   : "pub-c-acddd84b-6986-471f-8515-e6b8b23f59cb",
    subscribe_key : "sub-c-b240b038-0f7a-11e4-9284-02ee2ddab7fe",
    //cipher_key : "demo"
});
var twilio = require("twilio")('AC79502ebcbac523a3601433f2b7eb1fa8', '2611d6710b71ac4143eefb4bc9a1ecfe');
var EmergencyService = require("../services/EmergencyService");
var PoliceRecordService = require("../services/PoliceRecordService");

var locationLog = require("../models/Location").LocationModel;
var stateLog = require("../models/state").stateModel;
var destinationLog = require("../models/Destination").DestinationModel;
var DestinationService = new destinationLog();
var LocationService = new locationLog();
var stateService = new stateLog();

exports.locations = function (req, res) {
  LocationService.GetLocations(function(err, locations){
  	res.json(locations);
  });
};

exports.respondToTextMessage = function(req,res){
	var message = req.body;	
	var number = message.From.replace("+", "");
	DestinationService.ConfirmNumber(number);
	res.end();
}

exports.addDestination2 = function(req,res){
	var realBody = null;
	console.log(req.body);
	try{
		realBody = JSON.parse(Object.keys(req.body)[0].replace('\\n', '').replace("\\", ''));
	}catch(e){
		realBody = req.body;
	}
	var address = realBody.address;
	var contact = [realBody.contact];
	console.log(realBody);
	if(contact == null){
		contact = [contact]
	}
	if(address == null){
		console.log("USING FAKE ADDRESS");
		address = "5121 Folsom San Francisco";
	}
	request("http://maps.google.com/maps/api/geocode/json?address=" + address
			, function (error, response, body) {
		body = JSON.parse(body);
		if(body.results.length > 0){
		var data = body.results[0];
		console.log("DATA IS ", data);
		lat = data.geometry.location.lat;
		lng = data.geometry.location.lng;
		var obj = {
			contact : contact.map(function(e){return  {number : e, permission : false} }),
			latitude : lat,
			longitude : lng
		};

		twilio.sendMessage({
    		to:realBody.contact, // Any number Twilio can deliver to
    		from: '+15627350148', // A number you bought from Twilio and can use for outbound communication
    		body: 'You have been requested to assist this person(Mimee) home! Respond with yes to accept the invitation.' 

		}, function(err, responseData) {});
			DestinationService.addDestination(obj);
		}
		res.end();
	});
}

exports.addDestination = function(req,res){
	var realBody = null;
	console.log(req.body);
	try{
		realBody = JSON.parse(Object.keys(req.body)[0].replace('\\n', '').replace("\\", ''));
	}catch(e){
		realBody = req.body;
	}
	/*
	var address = realBody.address;
	var contact = [realBody.contact];
	console.log(realBody);
	if(contact == null){
		contact = [contact]
	}
	if(address == null){
		console.log("USING FAKE ADDRESS");
		address = "5121 Folsom San Francisco";
	}*/
	var address = realBody.address;
	var contact = realBody.contact;
	if(address == null){
		DestinationService.addContact(contact);
		twilio.sendMessage({
    		to: contact, // Any number Twilio can deliver to
    		from: '+15627350148', // A number you bought from Twilio and can use for outbound communication
    		body: 'You have been requested to assist this person(Mimee) home! Respond with yes to accept the invitation.' 

		}, function(err, responseData) {});
	}else{

		request("http://maps.google.com/maps/api/geocode/json?address=" + address["search term"]
			, function (error, response, body) {
			body = JSON.parse(body);
			if(body.results.length > 0){
				var data = body.results[0];
				console.log("DATA IS ", data);
				lat = data.geometry.location.lat;
				lng = data.geometry.location.lng;
				var obj = {
					contact : [],
					latitude : lat,
					longitude : lng
					};
				DestinationService.addDestination(obj);
				}
		});
	}
	res.end();
}

exports.endDestination = function(req,res){
	DestinationService.GetDestination(function(destination){
		if(destination==null){
			console.log("there was no destination....");
		}else{
		console.log("ENDING THE DESTINATION", destination);
		EmergencyService.notifyUsers(destination.contact, "The user you were following has finished his path!");
		}
	}); 
	
	DestinationService.endDestination();
	LocationService.Filter();
	stateService.Remove();
	res.end();
}

exports.getDestination = function(req,res){
	DestinationService.GetDestination(function(destination){
		res.json(destination);
	}); 
}

exports.getStates = function(req,res){
	stateService.GetStates(function(states){
		res.json(states);
	});
}

exports.addLocation = function(req,res){
	console.log(req.body);
	var realBody = JSON.parse(Object.keys(req.body)[0].replace('\\n', '').replace("\\", ''))
	if(realBody.point == null){
		state = realBody.state;
		date = realBody.date;
		if(date == null){
			date = new Date().toString();
		}
		realBody = {date : date, state : state};
		
		stateService.addState(realBody);
		EmergencyService.EvaluateState(state);
		res.end();
	}else{
		realBody = realBody.point;
		console.log(realBody);
		LocationService.AddLocation(realBody, function(err){
		EmergencyService.checkPerson(realBody);
		PoliceRecordService.checkCoordinates(realBody);

		LocationService.GetLocations(function(err, locations){
	     	pubnub.publish({
         		channel: 'NewLocations',
         		message: locations
    		 });
		})

		res.json(err);
	})
	}

}