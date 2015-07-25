(function(){
  'use strict';

  var store = angular.module('getCrafty.store', []);

  store.config(function($stateProvider) {
      $stateProvider.state('store', {
        url: '/store/{storeID}',
        templateUrl: 'store/store.html',
        controller: 'storeCtrl',
      });
  });

  store.controller('storeCtrl', function($scope, $state, $stateParams, $http) {
    var storeID = ($stateParams.storeID || "");
    
    $scope.store = {};
    
    // get store info
    var config = {
      url: 'http://www.getcrafty.co:3000/api/v1/stores/?id=' + storeID,
    }

    var responsePromise = $http(config);

    responsePromise.success(function(data, status, headers, config) {
      $scope.store = data[0];
      console.log($scope.store);
    });

    responsePromise.error(function(data, status, headers, config) {
      alert("AJAX failed!");
    });

    $scope.store.beers = {};

    var config = {
      url: 'http://www.getcrafty.co:3000/api/v1/productsAtStore?store_id=' + storeID,
    }

    var responsePromise = $http(config);

    responsePromise.success(function(data, status, headers, config) {
      $scope.store.beers = data;
    });

    responsePromise.error(function(data, status, headers, config) {
      $scope.store.beers = false;
    });

    $scope.emptyInventory = function(beer) {
      if (beer.inventory.quantity === 1) return 10;
      return 0;
    }
  });
})();
