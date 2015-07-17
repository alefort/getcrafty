(function(){
  'use strict';

  var beer = angular.module('getCrafty.beer', []);

  beer.config(function($stateProvider) {
      $stateProvider.state('beer', {
        url: '/beer/{beer_id}',
        templateUrl: 'beer/beer.html',
        controller: 'beerCtrl',
      });
  });

  beer.controller('beerCtrl', function($scope, $state, $stateParams, $http) {
    var beer_id = ($stateParams.beer_id || "");
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
