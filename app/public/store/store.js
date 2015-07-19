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

  store.controller('storeCtrl', function($scope, $state, $stateParams, $http, spinnerService) {
    var storeID = ($stateParams.storeID || "");
    
    $scope.getStoreInformation = function() {
      $scope.store = {};

      spinnerService.show('storeInformationSpinner');
      
      // get store info
      var config = {
        url: 'http://qa.getcrafty.co:3000/api/v1/stores/?id=' + storeID,
      }

      var responsePromise = $http(config);

      responsePromise.success(function(data, status, headers, config) {
        $scope.store = data[0];
        console.log($scope.store);
      });

      responsePromise.error(function(data, status, headers, config) {
        alert("AJAX failed!");
      });

      responsePromise.finally(function() {
        spinnerService.hide('storeInformationSpinner');
      });
    }

    $scope.getStoreBeers = function() {
      $scope.store.beers = {};

      spinnerService.show('storeBeersSpinner');

      var config = {
        url: 'http://qa.getcrafty.co:3000/api/v1/productsAtStore?store_id=' + storeID,
      }

      var responsePromise = $http(config);

      responsePromise.success(function(data, status, headers, config) {
        $scope.store.beers = data;
        console.log($scope.store.beers);
      });

      responsePromise.error(function(data, status, headers, config) {
        $scope.store.beers = false;
      });

      responsePromise.finally(function() {
        spinnerService.hide('storeBeersSpinner');
      });
    }
  });
})();
