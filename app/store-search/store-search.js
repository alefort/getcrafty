(function(){
  'use strict';

  var app = angular.module('getCrafty.storeSearch', ['ngRoute']);

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/store/', {
      templateUrl: 'store-search/store-search.html',
      controller: 'storeSearchCtrl'
    });
  }])

  app.controller('storeSearchCtrl', function($scope, $route, $routeParams, $http) {

  });
})();
