(function(){
    'use strict';

    angular
        .module('common.services')
        .factory('countryResource',
            ["$resource", countryResource]);

    function countryResource($resource) {
        return $resource('resources/countries.json');
    }
}());