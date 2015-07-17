(function(){
  'use strict';

  var beerSearch = angular.module('getCrafty.beerSearch', []);

  beerSearch.config(function($stateProvider) {
      $stateProvider.state('beerSearch', {
        url: '/beer/',
        templateUrl: 'beer-search/beer-search.html',
        controller: 'beerSearchCtrl',
      });
  });

  beerSearch.controller('beerSearchCtrl', function($scope, $route, $routeParams, $http) {
    
  });
})();
