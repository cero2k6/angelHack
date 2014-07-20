var twilio = require("twilio")('AC79502ebcbac523a3601433f2b7eb1fa8', '2611d6710b71ac4143eefb4bc9a1ecfe');
var request =  require('request');
exports.checkCoordinates = function(coordinates){
	var dist = .08333;
	var latitude = coordinates.latitude;
	var longitude = coordinates.longitude;
	var mb1 = latitude - dist;
	var mb2 = longitude - dist;
	var mb3 = latitude + dist;
	var mb4 = longitude + dist;
	var bbox = mb1 + "," + mb2 + "," + mb3 + "," + mb4; 
	var url = 'http://sanfrancisco.crimespotting.org/crime-data?format=json&bbox=' + bbox;
	console.log(url);
	request(url, function (error, response, body) {
  		if (!error && response.statusCode == 200) {
    		console.log(body) // Print the google web page.
    		if(body.features == null){
    			return;
    		}
    		var crimes = body.features.map(function(e){
    			return e.properties.crime_type;
    		}).join(",");
    			twilio.sendMessage({
    			to:'+17148673981', // Any number Twilio can deliver to
    			from: '+15627350148', // A number you bought from Twilio and can use for outbound communication
    			body: crimes + " was found in that person's area!" // body of the SMS message

			}, function(err, responseData) {});
  		}
	})

}