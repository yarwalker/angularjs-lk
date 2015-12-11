(function(){
    'use strict';

    angular
        .module('proApp')
        .controller('DialogController',
        ['$rootScope', 'ModalService', DialogController]);

    function DialogController($rootScope, ModalService) {
        var vm = this;


        /*$scope.showModal = function(){
            $dialog.dialog({}).open('views/modal/modalContent.html');
        };*/

        $rootScope.showModal = function() {
            ModalService.showModal();
        };

        $rootScope.okModal = function() {
            ModalService.okModal();
        };

        $rootScope.cancelModal = function() {
            ModalService.cancelModal();
        };

    }
}());
