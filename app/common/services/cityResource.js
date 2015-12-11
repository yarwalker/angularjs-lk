(function(){
    'use strict';

    angular
        .module('common.services')
        .factory('cityResource',
            ["$resource", cityResource]);

    function cityResource($resource) {
        return $resource('resources/cities.json');
    }
}());