'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
controller('AppCtrl', function ($scope, socket, $http) {
  $http.post("/api/locations", {latitude : 100, longitude : 150});
    $http.get("/api/locations").then(function (data) {
        var coords = data.data.map(function (coord) {
            return new google.maps.LatLng(coord.latitude, coord.longitude);
        });

        function initialize() {
            var mapOptions = {
                zoom: 3,
                center: new google.maps.LatLng(0, -180),
                mapTypeId: google.maps.MapTypeId.TERRAIN
            };

            var map = new google.maps.Map(document.getElementById('map-canvas'),
                mapOptions);

            var flightPlanCoordinates = [
                new google.maps.LatLng(37.772323, -122.214897),
                new google.maps.LatLng(21.291982, -157.821856),
                new google.maps.LatLng(-18.142599, 178.431),
                new google.maps.LatLng(-27.46758, 153.027892)
            ];
            console.log(flightPlanCoordinates);
            var flightPath = new google.maps.Polyline({
                path: flightPlanCoordinates,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });

            flightPath.setMap(map);
        }

        google.maps.event.addDomListener(window, 'load', initialize);
    })


    socket.on('send:name', function (data) {
        $scope.name = data.name;
    });
}).
controller('MyCtrl1', function ($scope, socket) {
    socket.on('send:time', function (data) {
        $scope.time = data.time;
    });
}).
controller('MyCtrl2', function ($scope) {
    // write Ctrl here
});