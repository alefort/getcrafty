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
    };

    $scope.postalSearch = function(addressQuery) {
      var coords = {},
          postal_pattern = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
          city_pattern = /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/,
          responsePromise,
          config = {},
          doAjax = false;;

      if (addressQuery.match(postal_pattern)) {
        addressQuery = addressQuery.replace(' ', '').replace('-', '');
        doAjax = true;

        var config = {
          url: 'http://geocoder.ca/?json=1&postal=' + addressQuery
        };
      } else if (addressQuery.match(city_pattern)) {
        doAjax = true;

        var config = {
          url: 'http://geocoder.ca/?json=1&city=' + addressQuery
        };
      }

      if (doAjax) {
        var responsePromise = $http(config);

        responsePromise.success(function(data, status, headers, config) {
          if (typeof(data.error) !== undefined) {
            $scope.getLocations(data.latt, data.longt);
          } else {
            $scope.stores = {};
            $scope.storesError = 'Please try your search again!';
          }
        });
      } else {
        $scope.stores = {};
        $scope.storesError = 'Please try your search again!';
      }
    }
  });
})();
