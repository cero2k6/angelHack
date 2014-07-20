 var pubnub = PUBNUB.init({
     publish_key: "pub-c-acddd84b-6986-471f-8515-e6b8b23f59cb",
     subscribe_key: "sub-c-b240b038-0f7a-11e4-9284-02ee2ddab7fe"
 })

 var PubNubService = function () {

 }


 PubNubService.publish = function (location) {
     pubnub.publish({
         post: false,
         channel: 'SafeWalk',
         message: JSON.stringify({
             'type': 'Location',
             'latitude': location.x,
             longitude: location.y
         }),
         callback: function (details) {
             console.log(details);
         }
     });
 };


 function initialize() {
     var mapOptions = {
         zoom: 3,
         center: new google.maps.LatLng(0, -180),
         mapTypeId: google.maps.MapTypeId.TERRAIN
     };

     var map = new google.maps.Map(document.getElementById('map-canvas'),
         mapOptions);

     pubnub.subscribe({
         channel: "SafeWalk",
         message: handleLocationChanged,
         connect: function () {
             console.log("CONNECTED!!");
         }
     });

     var flightPath = null;
     var handleLocationChanged = function (data) {
     	if(flightPath != null){
     		flightPath.setMap(null);
     	};
         var flightPlanCoordinates = data.map(function (coord) {
             return new google.maps.LatLng(coord.latitude, coord.longitude);
         })
         flightPath = new google.maps.Polyline({
             path: flightPlanCoordinates,
             geodesic: true,
             strokeColor: '#FF0000',
             strokeOpacity: 1.0,
             strokeWeight: 2
         });
         flightPath.setMap(map);
     };

     $.get('/api/locations', handleLocationChanged );
 }

 google.maps.event.addDomListener(window, 'load', initialize);