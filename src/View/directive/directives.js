'use strict';

/* directives */
angular.module('myApp.directives', [])

/*
*	MainViewCtrl
*	Controller for the route #/a, and #/a/:city
*/
.directive('firstDirective', function() {
	console.log('link - inner');
    return {
    	restrict: 'E',
    	template: '<div>Hello world</div>',
    	link: function(scope, element, attrs) {
        	console.log('link-link');
    	}
	}
});




