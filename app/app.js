(function(){
  'use strict';

  var app = angular.module('getCrafty', [
    'ngRoute',
    'ngGeolocation',
    'getCrafty.home',
    'getCrafty.beer',
    'getCrafty.beerSearch',
    'getCrafty.store',
    'getCrafty.storeSearch',
    'getCrafty.version'
  ]);

  app.config(function($locationProvider, $routeProvider) {
    $routeProvider.otherwise({redirectTo: '/'});
  });

})();
