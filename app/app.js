(function(){
  'use strict';

  var app = angular.module('getCrafty', [
    'ngRoute',
    'ngGeolocation',
    'mgcrea.ngStrap',
    'getCrafty.home',
    'getCrafty.beer',
    'getCrafty.beerSearch',
    'getCrafty.store',
    'getCrafty.stores',
    'getCrafty.version'
  ]);

  app.config(function($locationProvider, $routeProvider) {
    $routeProvider.otherwise({redirectTo: '/'});
  });

  app.controller('LocationTest', function($scope, $location) {
    $scope.currentPath = $location.path();
  });

})();
