(function(){
    "use strict";

    angular.module('common.services').factory('ModalService', ['$rootScope', function($rootScope) {

        $rootScope.modal = {
            title: '',
            body: '',
            show: false
        };

        // We return this object to anything injecting our service
        var Service = {};

        Service.showModal = function(title, body) {
            $rootScope.modal.show = true;
            $rootScope.modal.title = title;
            $rootScope.modal.body = body;
        };

        Service.okModal = function() {
            $rootScope.modal.show = false;
            $rootScope.modal.title = '';
            $rootScope.modal.body = '';
        };

        Service.cancelModal = function() {
            $rootScope.modal.show = false;
            $rootScope.modal.title = '';
            $rootScope.modal.body = '';
        };

        return Service;
    }]);

}());
