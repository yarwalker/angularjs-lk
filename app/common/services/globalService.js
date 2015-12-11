(function(){
    'use strict';

    angular
        .module('common.services')
        .factory('GlobalService', ['$cookies', '$resource', GlobalService]);

    function GlobalService($cookies, $resource){
        var user = { logged_in: false, attr: null };
        var group = {};
        var countries = {};

        function setUser( attr, logStatus ){
            user.logged_in = logStatus;
            user.attr = attr;

            //var expireDate = new Date();
            //expireDate.setDate(expireDate.getDate() + 1/24);
            // Setting a cookie
            $cookies.put('loggedin', ( logStatus ? 'true' : 'false')); //, {'expires': expireDate});
        }

        function getUser(){
            return user;
        }

        function getGroup(){
            return group;
        }

        function setGroup(attr){
            group = attr;
        }

        return {
            getUser: getUser,
            setUser: setUser,
            getGroup: getGroup,
            setGroup: setGroup
        };
    }
}());
