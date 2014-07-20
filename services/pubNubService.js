var PUBNUB = require("pubnub")
var location = require("../models/Location").LocationModel;

var EmergencyService = require("../services/EmergencyService");
var PoliceRecordService = require("../services/PoliceRecordService");
var LocationService = new location();
var pubnub = PUBNUB({
    publish_key   : "pub-c-acddd84b-6986-471f-8515-e6b8b23f59cb",
    subscribe_key : "sub-c-b240b038-0f7a-11e4-9284-02ee2ddab7fe",
    //cipher_key : "demo"
});

pubnub.subscribe({
    channel : "SafeWalk",
    message : handleMessage,
    connect : function(){
    	console.log("CONNECTED!!");
    }
 })

exports.publish = function(message){
	     pubnub.publish({
         channel: 'SafeWalk',
         message: message
     });
}

function handleMessage(m){
		try{
			var message = JSON.parse(m);
			handleLocationMessage(message);
		}catch(e){

		}
	}

function handleLocationMessage(message){
	console.log("HANDLING LOCATION MESSAGE", message);
	LocationService.AddLocation(message, function(err){
		EmergencyService.checkPerson(message);
		LocationService.GetLocations(function(err, locations){
	     	pubnub.publish({
         		channel: 'NewLocations',
         		message: locations
    		 });
		})
	});

}

