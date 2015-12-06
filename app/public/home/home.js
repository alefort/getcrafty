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

    $scope.input = {postal: ''};

    $geolocation.getCurrentPosition({
      timeout: 60000
    }).then(function(position) {
      coords = position.coords;
      $scope.getLocations(coords.latitude, coords.longitude);
    });

    $scope.getLocations = function(lat, lon) {
      var responsePromise,
          config = {};

        config.url = 'http://www.getcrafty.co:3000/api/v1/storesNear?lat=' + lat + '&long=' + lon;
        $scope.stores = {};
        responsePromise = $http(config);

        responsePromise.success(function(data, status, headers, config) {
          $scope.stores = data;
        });

        responsePromise.error(function(data, status, headers, config) {
          alert("AJAX failed!");
        });
    }

    $scope.postalSearch = function(postal) {
      var coords = {},
          postal_pattern = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
          city_pattern = /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/,
          responsePromise,
          config = {};
      
      if (postal.match(postal_pattern)) {
        postal = postal.replace(' ', '').replace('-', '');

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
      } else if (postal.match(city_pattern)) {

        var config = {
          url: 'http://geocoder.ca/?json=1&city=' + postal
        }

        var responsePromise = $http(config);

        responsePromise.success(function(data, status, headers, config) {
          $scope.getLocations(data.latt, data.longt);
        });

        responsePromise.error(function(data, status, headers, config) {
          alert("AJAX failed!");
        });
      } else {

      }
    }
  });
})();
