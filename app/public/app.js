(function(){
  'use strict';

  var app = angular.module('getCrafty', [
    'ui.router',
    'ngGeolocation',
    'mgcrea.ngStrap',
    'getCrafty.home',
    'getCrafty.beer',
    'getCrafty.beerSearch',
    'getCrafty.store',
    'getCrafty.stores',
    'getCrafty.version'
  ]);

  app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
  });

  app.run(
    ['$rootScope', '$state', '$stateParams', function ($rootScope,   $state,   $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }]
  );

  app.controller('LocationTest', function($scope, $location) {
    $scope.currentPath = $location.path();
  });

})();
