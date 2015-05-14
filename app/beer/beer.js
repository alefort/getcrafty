(function(){
  'use strict';

  var app = angular.module('getCrafty.beer', ['ngRoute']);

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/beer/:beer_id', {
      templateUrl: 'beer/beer.html',
      controller: 'beerCtrl'
    });
  }])

  app.controller('beerCtrl', function($scope, $route, $routeParams, $http) {
    var beer_id = ($routeParams.beer_id || "");
    $scope.beer_data = {};
    
    var config = {
      url: 'https://lcboapi.com/products/' + beer_id,
      headers: { 'Authorization': 'Token MDoyMjk2OWIyOC1kZjBlLTExZTQtYWQzOS0yN2NiZjIwYTYxY2Y6aFZhNUFiN3hZZllod245TW1hdGJuNHptRE1YRTUwaG9PUnFJ' }
    }

    var responsePromise = $http(config);

    responsePromise.success(function(data, status, headers, config) {
      $scope.beer = data.result;
    });

    responsePromise.error(function(data, status, headers, config) {
      alert("AJAX failed!");
    });
  });
})();
