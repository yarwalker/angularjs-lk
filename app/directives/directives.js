(function(){
    'use strict';

    var app = angular.module('proApp');

    app.directive('todoListTab', function(){
        return {
            restrict: 'E',
            templateUrl: 'views/partials/todoList.html'
        };
    });

    app.directive('joinCompanyTab', function(){
        return {
            restrict: 'E',
            templateUrl: 'views/partials/joinCompanyTab.html'
        };
    });

    app.directive('companyTab', function(){
        return {
            restrict: 'E',
            templateUrl: 'views/partials/companyTab.html'
        };
    });

    app.directive('foundCompanyList', function(){
        return {
            restrict: 'E',
            templateUrl: 'views/partials/foundCompanyList.html'
        };
    });




}());
