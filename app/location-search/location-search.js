(function(){
  'use strict';

  var app = angular.module('getCrafty.locationSearch', ['ngRoute']);

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/location/', {
      templateUrl: 'location-search/location-search.html',
      controller: 'locationSearchCtrl'
    });
  }])

  app.controller('locationSearchCtrl', function($scope, $route, $routeParams, $http) {

  });
})();
