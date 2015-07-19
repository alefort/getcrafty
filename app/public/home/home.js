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

    $geolocation.getCurrentPosition({
      timeout: 60000
    }).then(function(position) {
      coords = position.coords;
      config.url = 'http://qa.getcrafty.co:3000/api/v1/storesNear?lat=' + coords.latitude + '&long=' + coords.longitude;
      $scope.locationData = {};
      responsePromise = $http(config);

      responsePromise.success(function(data, status, headers, config) {
        console.log(data);
        $scope.locationData = data;
      });

      responsePromise.error(function(data, status, headers, config) {
        alert("AJAX failed!");
      });
    });
  });
})();
