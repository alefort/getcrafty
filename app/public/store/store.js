(function(){
  'use strict';

  var store = angular.module('getCrafty.store', []);

  store.config(function($stateProvider) {
      $stateProvider.state('store', {
        url: '/store/{storeID}',
        templateUrl: 'store/store.html',
        controller: 'storeCtrl'
      });
  });

  store.controller('storeCtrl', function($scope, $stateParams, $http, storeInformation, storeBeers) {
    var storeID = ($stateParams.storeID || "");
    var storePromise = storeInformation.get(storeID);
    var beersPromise = storeBeers.get(storeID);

    $scope.store = {};
    $scope.store.beers = {};
    $scope.searchText = null;

    storePromise.success(function(data) {
      $scope.store = data[0];
      console.log(data[0]);
    });

    beersPromise.success(function(data) {
      $scope.store.beers = data;
      console.log(data);
    });

    $scope.emptyInventory = function(beer) {
      if (beer.inventory.quantity === 1) return 10;
      return 0;
    };

    $scope.getBeerStyle = function(beer) {
      if (beer.varietal !== "") return beer.varietal.replace(/\(([^)]+)\)/, function(_, style) { return '(' + style.toUpperCase() + ')'; });;
      if (beer.tertiary_category !== "") return beer.tertiary_category;
      if (beer.secondary_category !== "") return beer.secondary_category;
      return beer.primary_category;
    };

    $scope.getInventory = function(beer) {
      if (beer.package.indexOf('x') !== -1) {
        return beer.inventory.quantity + ' ' + beer.package.charAt(0) + '-packs available';
      }

      return beer.inventory.quantity + ' ' + beer.package_unit_type + 's available';
    };

    $scope.googleMapURL = function(latitude, longitude) {
      return 'http://maps.google.com/maps?&z=17&q=LCBO&ll=' + latitude + "+" + longitude;
    }
  });

  store.factory('storeInformation', function($http) {
    var factory = {};

    factory.get = function(storeID) {
      var config = {
        url: 'http://www.getcrafty.co:3000/api/v1/stores/?id=' + storeID,
      };

      return $http(config);
    };

    return factory;
  });

  store.factory('storeBeers', function($http) {
    var factory = {};

    factory.get = function(storeID) {
      var config = {
        url: 'http://www.getcrafty.co:3000/api/v1/productsAtStore?store_id=' + storeID,
      };

      return $http(config);
    };

    return factory;
  });

})();
