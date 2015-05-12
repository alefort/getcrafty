(function(){
  'use strict';

  var app = angular.module('getCrafty.location', ['ngRoute']);

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/location/:location_id', {
      templateUrl: 'location/location.html',
      controller: 'locationCtrl'
    });
  }])

  app.controller('locationCtrl', function($scope, $route, $routeParams, $http) {
    var location_id = ($routeParams.location_id || "");
    $scope.location_data = {};
    
    var config = {
      url: 'https://lcboapi.com/stores/' + location_id,
      headers: { 'Authorization': 'Token MDoyMjk2OWIyOC1kZjBlLTExZTQtYWQzOS0yN2NiZjIwYTYxY2Y6aFZhNUFiN3hZZllod245TW1hdGJuNHptRE1YRTUwaG9PUnFJ' }
    }

    var responsePromise = $http(config);

    responsePromise.success(function(data, status, headers, config) {
      $scope.location = data.result;
    });

    responsePromise.error(function(data, status, headers, config) {
      alert("AJAX failed!");
    });
  });
})();
