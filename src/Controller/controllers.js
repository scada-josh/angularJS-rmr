// 'use strict';

// /* controllers */
angular.module('myApp.controllers', [])

// /*
// *	MainViewCtrl
// *	Controller for the route #/a, and #/a/:city
// */

.controller('mainCtrl',function($scope, TodosModel) {

	$scope.todos = TodosModel.todos();
	//console.log($scope.todos);

	$scope.zoomLevel = 9;
    
});

              
