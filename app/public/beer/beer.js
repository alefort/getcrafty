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

    /*
     todo     rewrite the following nasty chain of promises into proper success/then chains. The challenge
     todo     is that the last promise get depends on the first two completing before it can fire
     */
    beerPromise.success(function(data) {
      $scope.beer = data[0];

      if (storeURL) {
        $scope.store = {};
        var storePromise = storeInformation.get(storeURL);


        storePromise.success(function(data) {
          $scope.store = data[0];

          var storeBeerPromise = storeBeerInformation.get($scope.store.id, $scope.beer.id);

          storeBeerPromise.success(function(data) {
            $scope.store_beer = data[0];
          });
        });
      }
    });
  });

  beer.factory('beerInformation', function($http) {
    var factory = {};

    factory.get = function(beerID) {
      var config = {
        url: 'http://192.168.33.11:3000/api/v1/products/?url_friendly_name=' + beerID
      };

      return $http(config);
    };

    return factory;
  });

  beer.factory('storeInformation', function($http) {
    var factory = {};

    factory.get = function(storeURL) {
      var config = {
        url: 'http://192.168.33.11:3000/api/v1/stores/?url_friendly_name=' + storeURL
      };

      return $http(config);
    };

    return factory;
  });

  beer.factory('storeBeerInformation', function($http) {
    var factory = {};

    factory.get = function(storeID, beerID) {
      var config = {
        url: 'http://192.168.33.11:3000/api/v1/inventories?store_id=' + storeID + '&product_id=' + beerID
      };

      return $http(config);
    };

    return factory;
  });
})();