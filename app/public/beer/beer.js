(function(){
  'use strict';

  var beer = angular.module('getCrafty.beer', []);

  beer.config(function($stateProvider) {
      $stateProvider.state('beer', {
        url: '/beer/{beerID}/{storeURL}',
        templateUrl: 'beer/beer.html',
        controller: 'beerCtrl'
      });
  });

  beer.controller('beerCtrl', function($scope, $state, $stateParams, $http, beerInformation, storeInformation, storeBeerInformation) {
    var beerID = ($stateParams.beerID || "");
    var storeURL = ($stateParams.storeURL || "");
    $scope.beer_data = {};

    var beerPromise = beerInformation.get(beerID);

    beerPromise.success(function(data) {
      $scope.beer = data[0];
    });

    if (storeURL) {
      $scope.store = {};
      var storePromise = storeInformation.get(storeURL);
      var storeBeerPromise = storeBeerInformation.get(storeURL, beerID);

      storePromise.success(function(data) {
        $scope.store = data[0];
      });

      storeBeerPromise.success(function(data) {
        $scope.store_beer = data[0];
      });
    }
  });

  beer.factory('beerInformation', function($http) {
    var factory = {};

    factory.get = function(beerID) {
      var config = {
        url: 'http://192.168.33.11:3000/api/v1/products/?id=' + beerID
      };

      return $http(config);
    };

    return factory;
  });

  beer.factory('storeInformation', function($http) {
    var factory = {};

    factory.get = function(storeURL) {
      var config = {
        url: 'http://192.168.33.11:3000/api/v1/stores/?id=' + store
      };

      return $http(config);
    };

    return factory;
  });

  beer.factory('storeBeerInformation', function($http) {
    var factory = {};

    factory.get = function(storeURL, beerID) {
      var config = {
        url: 'http://192.168.33.11:3000/api/v1/inventories?store_url=' + storeURL + '&product_id=' + beerID
      };

      return $http(config);
    };

    return factory;
  });
})();