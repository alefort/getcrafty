'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]).controller("MyController", function($scope, $http) {
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


    } );
