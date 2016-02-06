(function(){
  'use strict';

  var app = angular.module('getCrafty', [
    'ngAnimate',
    'ngMaterial',
    'ui.router',
    'ngGeolocation',
    'angular-loading-bar',
    'angular-toArrayFilter',
    'ngStorage',
    'vAccordion',
    'getCrafty.home',
    'getCrafty.beer',
    'getCrafty.beerSearch',
    'getCrafty.store',
    'getCrafty.stores',
    'getCrafty.version'
  ]);

  app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
  });

  app.run(
    ['$rootScope', '$state', '$stateParams', function ($rootScope,   $state,   $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }]
  );

  app.controller('LocationTest', function($scope, $location) {
    $scope.currentPath = $location.path();
  });

  app.controller('BodyCtrl', function($scope, $localStorage, $sessionStorage, $mdSidenav) {
    $scope.$storage = $localStorage.$default({
      storeSearch: '',
      beerSearch: '',
      stores: [],
    });

    $scope.openMenu = function() {
      $mdSidenav('main').toggle();
    };

    $scope.loadFinished = function() {
      setTimeout(function() {
        angular.element(document.querySelector('#loading-screen')).removeClass('active');
      }, 1000);
    }
  });

  app.directive('whenReady', ['$interpolate', function($interpolate) {
    return {
      restrict: 'A',
      priority: Number.MIN_SAFE_INTEGER, // execute last, after all other directives if any.
      link: function($scope, $element, $attributes) {
        var expressions = $attributes.whenReady.split(';');
        var waitForInterpolation = false;
        var hasReadyCheckExpression = false;

        function evalExpressions(expressions) {
          expressions.forEach(function(expression) {
            $scope.$eval(expression);
          });
        }

        if ($attributes.whenReady.trim().length === 0) { return; }

        if ($attributes.waitForInterpolation && $scope.$eval($attributes.waitForInterpolation)) {
            waitForInterpolation = true;
        }

        if ($attributes.readyCheck) {
          hasReadyCheckExpression = true;
        }

        if (waitForInterpolation || hasReadyCheckExpression) {
          requestAnimationFrame(function checkIfReady() {
            var isInterpolated = false;
            var isReadyCheckTrue = false;

            if (waitForInterpolation && $element.text().indexOf($interpolate.startSymbol()) >= 0) { // if the text still has {{placeholders}}
              isInterpolated = false;
            }
            else {
              isInterpolated = true;
            }

            if (hasReadyCheckExpression && !$scope.$eval($attributes.readyCheck)) { // if the ready check expression returns false
              isReadyCheckTrue = false;
            }
            else {
              isReadyCheckTrue = true;
            }

            if (isInterpolated && isReadyCheckTrue) { evalExpressions(expressions); }
            else { requestAnimationFrame(checkIfReady); }

          });
        }
        else {
          evalExpressions(expressions);
        }
      }
    };
  }]);

})();
