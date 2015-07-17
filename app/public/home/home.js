(function(){
	'use strict';

	var home = angular.module('getCrafty.home', []);

	home.config(function($stateProvider) {
	    $stateProvider.state('main', {
	    	url: '/',
	    	templateUrl: 'home/home.html',
	    });
	});

	home.controller('homeCtrl', [function() {

	}]);
})();
