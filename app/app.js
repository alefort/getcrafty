(function(){
  'use strict';

  var app = angular.module('getCrafty', [
    'ngRoute',
    'getCrafty.beer',
    'getCrafty.home',
    'getCrafty.version'
  ]);

  app.config(function($locationProvider, $routeProvider) {
    $routeProvider.otherwise({redirectTo: '/'});
  });

})();
