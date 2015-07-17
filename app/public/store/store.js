(function(){
  'use strict';

  var store = angular.module('getCrafty.store', []);

  store.config(function($stateProvider) {
      $stateProvider.state('store', {
        url: '/store/{store_id}',
        templateUrl: 'store.html',
        controller: 'storeCtrl',
      });
  });

  store.controller('storeCtrl', function($scope, $route, $routeParams, $http) {
    var store_id = ($routeParams.store_id || "");
    $scope.store_data = {};
    
    var config = {
      url: 'https://lcboapi.com/stores/' + store_id,
      headers: { 'Authorization': 'Token MDoyMjk2OWIyOC1kZjBlLTExZTQtYWQzOS0yN2NiZjIwYTYxY2Y6aFZhNUFiN3hZZllod245TW1hdGJuNHptRE1YRTUwaG9PUnFJ' }
    }

    var responsePromise = $http(config);

    responsePromise.success(function(data, status, headers, config) {
      $scope.store = data.result;
    });

    responsePromise.error(function(data, status, headers, config) {
      alert("AJAX failed!");
    });
  });
})();
