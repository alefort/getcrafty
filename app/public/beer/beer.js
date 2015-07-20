(function(){
  'use strict';

  var beer = angular.module('getCrafty.beer', []);

  beer.config(function($stateProvider) {
      $stateProvider.state('beer', {
        url: '/beer/{beerID}/{storeID}',
        templateUrl: 'beer/beer.html',
        controller: 'beerCtrl',
      });
  });

  beer.controller('beerCtrl', function($scope, $state, $stateParams, $http) {
    var beerID = ($stateParams.beerID || "");
    var storeID = ($stateParams.storeID || "");
    $scope.beer_data = {};

    // get store info
    var config = {
      url: 'http://qa.getcrafty.co:3000/api/v1/products/?id=' + beerID,
    }

    var responsePromise = $http(config);

    responsePromise.success(function(data, status, headers, config) {
      $scope.beer = data[0];
    });

    responsePromise.error(function(data, status, headers, config) {
      alert("AJAX failed!");
    });

    if (storeID) {
      $scope.store = {};

      // get store info
      var config = {
        url: 'http://qa.getcrafty.co:3000/api/v1/stores/?id=' + storeID,
      }

      var responsePromise = $http(config);

      responsePromise.success(function(data, status, headers, config) {
        $scope.store = data[0];
      });

      responsePromise.error(function(data, status, headers, config) {
        alert("AJAX failed!");
      });
    }
  });
})();
