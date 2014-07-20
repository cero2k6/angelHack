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
             latitude: location.x,
             longitude: location.y,
             date: new Date()
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

         $.get('/api/destinations', function (destination) {
             console.log(destination);
             if (destination != null) {
                 var marker = new google.maps.Marker({
                     position: new google.maps.LatLng(destination.latitude, destination.longitude),
                     map: map,
                     title: 'Destination'
                 });
             }
         });

     var flightPath = null;
     var handleLocationChanged = function (data) {

         if (flightPath != null) {
             flightPath.setMap(null);
         };

         var flightPlanCoordinates = data
             .sort(function (e1, e2) {
                 return new Date(e1.date).getTime() - new Date(e2.date).getTime();
             })
             .map(function (coord) {
                 return new google.maps.LatLng(coord.latitude, coord.longitude);
             })
         if (data.length > 0) {
             map.setCenter(new google.maps.LatLng(data[0].latitude, data[0].longitude));
             var marker = new google.maps.Marker({
                 position: flightPlanCoordinates[0],
                 map: map,
                 title: 'Start Position'
             });
         }


         var lineSymbol = {
             path: 'M 0,-1 0,1',
             strokeOpacity: 1,
             scale: 4
         };
         flightPath = new google.maps.Polyline({
             path: flightPlanCoordinates,
             strokeOpacity: 0,
             icons: [{
                 icon: lineSymbol,
                 offset: '0',
                 repeat: '20px'
             }],
             geodesic: true,
             strokeColor: '#FF0000',
             strokeWeight: 2
         });
         flightPath.setMap(map);
     };
     pubnub.subscribe({
         channel: "NewLocations",
         message: handleLocationChanged,
         connect: function () {
             console.log("CONNECTED!!");
         }
     });
     $.get('/api/locations', handleLocationChanged);
     setInterval(function () {
         $.get('/api/locations', handleLocationChanged);
     }, 50000);
 }

 google.maps.event.addDomListener(window, 'load', initialize);
var mapper = {
	"in a car" : 1,
	"running" : .5,
	"none" : .25,
	"not moving" : 0,
}
$.get("/api/states", function(states){
	console.log(states);
	states = states
	        .sort(function (e1, e2) {
                 return new Date(e2.date).getTime() - new Date(e1.date).getTime();
             })
	        .filter(function(e1){
	        	return new Date(e1.date).getTime()%2==0
	        })
	        .slice(0,30)
			.map(function(state, i){
		return [new Date(state.date), mapper[state.state]==undefined?0:mapper[state.state]];
	})
	console.log(states);
   $('#state-chart').highcharts({
            chart: {
                zoomType: 'x'
            },
            title: {
                text: 'State changes in Activity'
            },
            xAxis : {
            	type : 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Exchange rate'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
    
            series: [{
                type: 'area',
                name: 'State Changes',
                data: 
                    states
                
            }]
        });

});
     