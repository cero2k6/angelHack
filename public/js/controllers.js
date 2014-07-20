'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function ($scope, socket, $http) {
    $scope.addDestination = function(){
      $http.post("/api/addDestination", {address : $scope.address, contact : [$scope.contact]});
    }

    $scope.endDestination  = function(){
      $http.post("/api/endDestination");
    }

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
