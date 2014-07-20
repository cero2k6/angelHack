var twilio = require("twilio")('AC79502ebcbac523a3601433f2b7eb1fa8', '2611d6710b71ac4143eefb4bc9a1ecfe');
exports.checkPerson = function(coordinates){
	twilio.sendMessage({
    to:'+17148673981', // Any number Twilio can deliver to
    from: '+15627350148', // A number you bought from Twilio and can use for outbound communication
    body: 'word to your mother.' // body of the SMS message

	}, function(err, responseData) {});
}