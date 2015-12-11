(function(){
    'use strict';

    angular
        .module('common.services')
        .factory('todoListResource',
        ["$resource", todoListResource]);

    function todoListResource($resource) {
        return $resource('resources/todo_list.json').$promise;
    }
}());