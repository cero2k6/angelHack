 var pubnub = PUBNUB.init({
         publish_key   : "pub-c-acddd84b-6986-471f-8515-e6b8b23f59cb",
         subscribe_key : "sub-c-b240b038-0f7a-11e4-9284-02ee2ddab7fe"
 })

 var PubNubService = function(){
 	var handleMessage = function(message){
 		console.log(message);
 	}

  	pubnub.subscribe({
    channel : "SafeWalk",
    message : handleMessage,
    connect : function(){
    	console.log("CONNECTED!!");
    	}
 	})
 }



 	PubNubService.publish = function(location){
 		pubnub.publish({
		post: false,
		channel : 'SafeWalk',
		message : JSON.stringify({ 'type' : 'Location' , 'latitude' : location.x, longitude : location.y}),
		callback : function(details){
			console.log(details);
			}
		});
 	};


