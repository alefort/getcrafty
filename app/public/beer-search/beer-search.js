(function(){
  'use strict';

  var app = angular.module('getCrafty.beerSearch', ['ngRoute']);

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/beer/', {
      templateUrl: 'beer-search/beer-search.html',
      controller: 'beerSearchCtrl'
    });
  }])

  app.controller('beerSearchCtrl', function($scope, $route, $routeParams, $http) {
    
  });
})();
