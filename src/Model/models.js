'use strict';

// /* services */
angular.module('myApp.services', [])

// /*
// *	TodosModel
// *	Model for Store Something
// */
.service('TodosModel',function() {

	var todos = [{text:'learn angular555', done:true},{text:'build an angular app', done:false},{text:'learn PHP', done:false}];

    this.todos = function() {
    	return todos; 
    };

});