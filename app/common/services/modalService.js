(function(){
    "use strict";

    angular.module('common.services')
        .factory('ModalService', ['$rootScope', '$uibModal', function($rootScope, $uibModal) {

        $rootScope.modal = {
            title: '',
            body: '',
            show: false
        };

        // We return this object to anything injecting our service
        var Service = {};

        Service.showModal = function(title, body, tmpl) {

            $rootScope.title = title;
            $rootScope.body = body;

            if( tmpl == null ){
                tmpl = 'modalMsg';
            }

            $rootScope.opts = {
                backdrop: true,
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                templateUrl : 'views/partials/' + tmpl + '.html',
                controller : ModalInstanceCtrl,
                resolve: {} // empty storage
            };


            $rootScope.opts.resolve.item = function() {
                return angular.copy({ title: $rootScope.title, body: $rootScope.body }); // pass name to Dialog
            }

            var modalInstance = $uibModal.open($rootScope.opts);

            modalInstance.result.then(function(){
                //on ok button press
            },function(){
                //on cancel button press
                console.log("Modal Closed");
            });
        };

        /*Service.showForgetPassModal = function(){
            $rootScope.title = 'Восстановление пароля';
            $rootScope.body = '<p>Укажите свой email</p><input type="email" name="recovery-email" id="recovery-email" class="form-control" type="email" autocomplete="off">';

            $rootScope.opts = {
                backdrop: true,
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                templateUrl : 'views/partials/modalForgetPass.html',
                controller : ModalInstanceCtrl,
                resolve: {} // empty storage
            };


            $rootScope.opts.resolve.item = function() {
                return angular.copy({ title: $rootScope.title }); // pass name to Dialog
            }

            var modalInstance = $uibModal.open($rootScope.opts);

            modalInstance.result.then(function(){
                //on ok button press
            },function(){
                //on cancel button press
                console.log("Modal Closed");
            });
        };*/

        var ModalInstanceCtrl = function($rootScope, $uibModalInstance, $uibModal, item) {

            $rootScope.item = item;

            $rootScope.ok = function () {
                $uibModalInstance.close();
            };

            $rootScope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }

       /* Service.showModal = function(title, body) {
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
        };*/

        return Service;
    }]);



}());
