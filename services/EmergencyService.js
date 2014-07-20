var location = require("../models/Location").LocationModel;
var LocationService = new location();
var destinationLog = require("../models/Destination").DestinationModel;
var DestinationService = new destinationLog();
var request = require("request");

var twilio = require("twilio")('AC79502ebcbac523a3601433f2b7eb1fa8', '2611d6710b71ac4143eefb4bc9a1ecfe');
exports.checkPerson = function(coordinates){
	LocationService.GetLocationsByDate(new Date(coordinates.date), function(locations){
		DestinationService.GetDestination(function(destination){
			var rates = locations.map(function(source){
				return Math.pow(destination.latitude - source.latitude, 2) + Math.pow(destination.longitude - source.longitude,2);
			});
			var noViolations = detectProblems(rates);
			if(noViolations){
				console.log("violation occurred, notifying users!");
				notifyUser(destination.contact);
			}
		});
	});
}

function detectProblems(dataset){
	var violationCount = 0;
	if(dataset.length > 1){
		for(var i = 1; i < dataset.length; i++){
			if(dataset[i] == dataset[i-1]){
				violationCount++;
			}
			if(dataset[i] > dataset[i-1]*1.1){
				violationCount = violationCount + 2;
			}
			if(dataset[i] > dataset[i-1]*1.4){
				violationCount = violationCount + 3;
			}
			if(dataset[i] < dataset[i-1]){
				violationCount--;
			}
		}
	}
	return violationCount < dataset.length;
}

function notifyUser(contacts){
	contacts.forEach(function(number){
		twilio.sendMessage({
    	to:'+17148673981', // Any number Twilio can deliver to
    	from: '+15627350148', // A number you bought from Twilio and can use for outbound communication
    	body: 'emergency message' // body of the SMS message

		}, function(err, responseData) {});
	})

}