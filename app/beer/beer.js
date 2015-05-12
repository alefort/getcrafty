(function(){
	'use strict';

	var app = angular.module('getCrafty.beer', ['ngRoute']);

	app.config(['$routeProvider', function($routeProvider) {
	  $routeProvider.when('/app/beer', {
	    templateUrl: 'beer/beer.html',
	    controller: 'beerCtrl'
	  });
	}])

	app.controller('beerCtrl', [ '$http', function($htto) {
		$scope.myData = {};
	    $scope.myData.doClick = function(item, event) {

	      var config = {
	        url: 'https://lcboapi.com/products/288506',
	        headers: { 'Authorization': 'Token MDoyMjk2OWIyOC1kZjBlLTExZTQtYWQzOS0yN2NiZjIwYTYxY2Y6aFZhNUFiN3hZZllod245TW1hdGJuNHptRE1YRTUwaG9PUnFJ' }
	      }
	      var responsePromise = $http(config);

	      responsePromise.success(function(data, status, headers, config) {
	        $scope.myData.fromServer = data;
	      });
	      responsePromise.error(function(data, status, headers, config) {
	        alert("AJAX failed!");
	      });
	    }
	}]);
})();
