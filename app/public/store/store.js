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

  store.controller('storeCtrl', function($scope, $stateParams, $http, storeInformation, storeBeers, beerFilters) {
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
      $scope.filters = beerFilters.get($scope.store.beers);
      console.log('yay');
      console.log($scope.filters);
      console.log('yay');
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

  store.factory('beerFilters', function(storeBeers) {
    var factory = {};

    factory.get = function(beers) {
      var filters = {};

      filters['styles'] = {
        filter_type_title: 'Beer Styles',
        filter_type: 'styles',
        filter_type_active: false,
        filters: {},
      };

      angular.forEach(beers, function(beer) {
        var beerStyle = beer.varietal;

        if (beerStyle === "") {
          beerStyle = beer.tertiary_category;
        }

        if (beerStyle === "") {
          beerStyle = beer.secondary_category;
        }

        if (typeof filters.styles.filters[beerStyle] === 'undefined') {
          filters.styles.filters[beerStyle] = {
            filter_name: beerStyle,
            filter_active: false,
          }
        }
      });

      //console.log(filters);
      return filters;
    }

    return factory;
  });

})();
