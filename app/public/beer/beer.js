(function(){
  'use strict';

  var beer = angular.module('getCrafty.beer', []);

  beer.config(function($stateProvider) {
      $stateProvider.state('beer', {
        url: '/beer/{beerID}',
        templateUrl: 'beer/beer.html',
        controller: 'beerCtrl',
      });
  });

  beer.controller('beerCtrl', function($scope, $state, $stateParams, $http) {
    var beerID = ($stateParams.beerID || "");
    $scope.beer_data = {};
    
    // get store info
    var config = {
      url: 'http://qa.getcrafty.co:3000/api/v1/products/?id=' + beerID,
    }

    var responsePromise = $http(config);

    responsePromise.success(function(data, status, headers, config) {
      $scope.beer = data[0];
      console.log($scope.beer);
    });

    responsePromise.error(function(data, status, headers, config) {
      alert("AJAX failed!");
    });
  });
})();
