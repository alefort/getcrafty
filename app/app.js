(function(){
  'use strict';

  var app = angular.module('getCrafty', [
    'ngRoute',
    'getCrafty.home',
    'getCrafty.beer',
    'getCrafty.beerSearch',
    'getCrafty.location',
    'getCrafty.locationSearch',
    'getCrafty.version'
  ]);

  app.config(function($locationProvider, $routeProvider) {
    $routeProvider.otherwise({redirectTo: '/'});
  });

})();
