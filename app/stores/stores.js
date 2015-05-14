(function(){
  'use strict';

  var app = angular.module('getCrafty.stores', [
    'ngRoute',
    'ngGeolocation'
  ]);

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/stores/', {
      templateUrl: 'stores/stores.html',
      controller: 'storesCtrl'
    });
  }])

  app.controller('storesCtrl', function($scope, $route, $routeParams, $http, $geolocation) {
    var coords = {},
        responsePromise,
        config = {
          headers: { 'Authorization': 'Token MDoyMjk2OWIyOC1kZjBlLTExZTQtYWQzOS0yN2NiZjIwYTYxY2Y6aFZhNUFiN3hZZllod245TW1hdGJuNHptRE1YRTUwaG9PUnFJ' }
        };

    $geolocation.getCurrentPosition({
      timeout: 60000
    }).then(function(position) {
      coords = position.coords;
      config.url = 'https://lcboapi.com/stores?&lat=' + coords.latitude + '&lon=' + coords.longitude;
      $scope.locationData = {};
      responsePromise = $http(config);

      responsePromise.success(function(data, status, headers, config) {
        $scope.locationData = data.result;
      });

      responsePromise.error(function(data, status, headers, config) {
        alert("AJAX failed!");
      });
    });
  });
})();
