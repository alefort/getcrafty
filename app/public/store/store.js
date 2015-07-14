(function(){
  'use strict';

  var app = angular.module('getCrafty.store', ['ngRoute']);

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/store/:store_id', {
      templateUrl: 'store/store.html',
      controller: 'storeCtrl'
    });
  }])

  app.controller('storeCtrl', function($scope, $route, $routeParams, $http) {
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
