(function(){
    'use strict';

    angular
        .module('proApp')
        .controller('UserController',
            [ '$scope', '$rootScope', '$cookies', '$location', 'GlobalService', 'SocketService', 'ModalService', 'MessageService', '$captcha', UserController]);

    function UserController( $scope, $rootScope, $cookies, $location, GlobalService, SocketService, ModalService, MessageService, $captcha ) {

        var modal_title, modal_body;

        //$scope.captcha_result = '';
        $scope.submitEditProfileForm = function(user){
            console.log('submitEditProfileForm');

            if($captcha.checkResult(user.captcha_result) == true) {
                // капча верна
                var promise = SocketService.setUserAttributes(user);

                promise
                    .then(function(data){
                        console.log('data:');
                        console.log(data);
                        if( data.error !== undefined ){
                            console.log('error: '); console.log(data);
                            modal_title = 'Ошибка';
                            modal_body = MessageService.getMessage( data.error.code );
                            ModalService.showModal(modal_title, modal_body);
                        } else {
                            // выводим сообщение о cохраненных данных юзера
                            modal_title = 'Сообщение';
                            modal_body = MessageService.getMessage( 1003 );
                            ModalService.showModal(modal_title, modal_body);

                            // сохраним данные в глобальную переменную
                            // обновим данные юзера
                            var user_promise = SocketService.getUserInfo();

                            user_promise
                                .then(function(data){
                                    // данные получены
                                    // сохраним данные в глобальную переменную
                                    GlobalService.setUser( data.result, true );
                                }, function(error){
                                    // ошибка GetUserInfo
                                    // console.log('GetUserInfo promise failed', error);
                                    modal_title = 'Ошибка';
                                    modal_body = MessageService.getMessage( error );
                                    ModalService.showModal(modal_title, modal_body);
                                });

                            $rootScope.user = GlobalService.getUser();
                        }
                    }, function(error){
                        console.log('error:');
                        console.log(error);
                        modal_title = 'Ошибка';
                        modal_body = MessageService.getMessage(error);
                        ModalService.showModal(modal_title, modal_body);
                    });
            }
            //error captcha
            else {
                console.log("Captcha Error");
            }
        };

        $scope.changePassword = function(struct){
            console.log('changePassword');

            console.log(struct);

        }

        $scope.submitUserRegForm = function(user){
            console.log('submitUserRegForm');

            if($captcha.checkResult(user.captcha_result) == true) {
                // капча верна
                var promise = SocketService.createUser(user);

                promise
                    .then(function(data){
                        console.log('data:');
                        console.log(data);
                        if( data.error !== undefined ){
                            //console.log('error: '); console.log(data);
                            modal_title = 'Ошибка';
                            modal_body = MessageService.getMessage( data.error.code );
                            ModalService.showModal(modal_title, modal_body);
                        } else {
                            // сохраним данные в глобальную переменную
                            GlobalService.setUser( data.result, true );
                            $scope.user = GlobalService.getUser();
                            $rootScope.loggedIn = true;
                        }
                    }, function(error){
                        console.log('error:');
                        console.log(error);
                        modal_title = 'Ошибка';
                        modal_body = MessageService.getMessage(error);
                        ModalService.showModal(modal_title, modal_body);
                    });
            }
            //error captcha
            else {
                console.log("Captcha Error");
            }
        };

        if( $cookies.get('loggedin') !== 'undefined' && $cookies.get('loggedin') == 'true' ){
            // получаем данные юзера

            var user = GlobalService.getUser();

            if( user.attr === null ){
                var user_promise = SocketService.getUserInfo();

                user_promise
                    .then(function(data){
                        // данные получены
                        console.log(data);

                        if( data.error !== undefined ){
                            //console.log('error: '); console.log(data);
                            modal_title = 'Ошибка';
                            modal_body = MessageService.getMessage( data.error.code );
                            ModalService.showModal(modal_title, modal_body);
                        } else {
                            // сохраним данные в глобальную переменную
                            GlobalService.setUser( data.result, true );
                            user = GlobalService.getUser();
                            $scope.user = user;
                            $rootScope.loggedIn = true;
                        }
                    }, function(error){
                        // ошибка GetUserInfo
                        console.log('GetUserInfo promise failed', error);
                        modal_title = 'Ошибка';
                        modal_body = MessageService.getMessage(error);
                        ModalService.showModal(modal_title, modal_body);
                    });
            }
        } else {
            if( $location.url() != '/register') {
                // пенеаправляем на авторизацию
                $location.path('/');
            }

        }

        $scope.user = user;

        $scope.change_pass = {
            login: user.attr.login,
            old_pass: '',
            new_pass: ''
        }
    }
}());