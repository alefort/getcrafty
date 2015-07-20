(function(){
  'use strict';

  var home = angular.module('getCrafty.home', []);

  home.config(function($stateProvider) {
      $stateProvider.state('main', {
        url: '/',
        templateUrl: 'home/home.html',
        controller: 'homeCtrl',
      });
  });

  home.controller('homeCtrl', function($scope, $state, $stateParams, $http, $geolocation) {
    var coords = {},
        responsePromise,
        config = {};

    $scope.input = {postal: 'M5V1K1'}; // TODO: change to empty string when done testing

    $geolocation.getCurrentPosition({
      timeout: 60000
    }).then(function(position) {
      coords = position.coords;
      $scope.getLocations(coords.latitude, coords.longitude);
    });

    $scope.getLocations = function(lat, lon) {
      var responsePromise,
          config = {};

        config.url = 'http://qa.getcrafty.co:3000/api/v1/storesNear?lat=' + lat + '&long=' + lon;
        $scope.locationData = {};
        responsePromise = $http(config);

        responsePromise.success(function(data, status, headers, config) {
          $scope.locationData = data;
        });

        responsePromise.error(function(data, status, headers, config) {
          alert("AJAX failed!");
        });
    }

    $scope.postalSearch = function(postal) {
      var coords = {},
          responsePromise,
          config = {};

      var config = {
        url: 'http://geocoder.ca/?json=1&postal=' + postal
      }

     var responsePromise = $http(config);

      responsePromise.success(function(data, status, headers, config) {
        $scope.getLocations(data.latt, data.longt);
      });

      responsePromise.error(function(data, status, headers, config) {
        alert("AJAX failed!");
      });
    }
  });
})();
