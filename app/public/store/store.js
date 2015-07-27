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

  store.controller('storeCtrl', function($scope, $stateParams, $http, storeInformation, storeBeers) {
    var storeID = ($stateParams.storeID || "");
    var storePromise = storeInformation.get(storeID);
    var beersPromise = storeBeers.get(storeID);

    $scope.store = {};
    $scope.store.beers = {};

    storePromise.success(function(data) {
      $scope.store = data[0];
    });

    beersPromise.success(function(data) {
      $scope.store.beers = data;
    });

    $scope.emptyInventory = function(beer) {
      if (beer.inventory.quantity === 1) return 10;
      return 0;
    }
  });

  store.factory('storeInformation', function($http) {
    var factory = {};

    factory.get = function(storeID) {
      var config = {
        url: 'http://www.getcrafty.co:3000/api/v1/stores/?id=' + storeID,
      }

      return $http(config);
    }

    return factory;
  });

  store.factory('storeBeers', function($http) {
    var factory = {};

    factory.get = function(storeID) {
      var config = {
        url: 'http://www.getcrafty.co:3000/api/v1/productsAtStore?store_id=' + storeID,
      }

      return $http(config);
    }

    return factory;
  });

})();
