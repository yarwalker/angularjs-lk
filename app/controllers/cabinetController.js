(function(){
    'use strict';

    angular
        .module('proApp')
        .controller('CabinetController', [ '$scope', '$rootScope', '$cookies', '$location', 'GlobalService', 'SocketService', 'ModalService', 'MessageService',
            "$captcha",
            CabinetController]);

    function CabinetController( $scope, $rootScope, $cookies, $location, GlobalService, SocketService, ModalService, MessageService,
                                $captcha
    ) {
        //console.log('CabinetController cookies');
        //console.log($cookies.get('loggedin'));
        var modal_title = 'Сообщение',
            modal_body = '';



        if( $cookies.get('loggedin') !== 'undefined' ){
            $rootScope.loggedIn = ( $cookies.get('loggedin') == 'true' ? true : false );
        }
        else {
            $rootScope.loggedIn = false;
            $cookies.put('loggedin', 'false');
        }


        if( $cookies.get('loggedin') !== 'undefined' && $cookies.get('loggedin') == 'true' ){
            $rootScope.user = GlobalService.getUser();
        }

       // console.log('CabinetController');
       // console.log(GlobalService.getUser());

        $scope.submitLoginForm = function(){
            var promise = SocketService.authorize($scope.login, $scope.password);

            promise
                .then(function(data) {
                    var user_promise;

                    // успешная авторизация
                    //console.log('My first promise succeeded', data);

                    if( data.error !== undefined )
                    {
                        //console.log('error: '); console.log(data);
                        modal_title = 'Ошибка';
                        modal_body = MessageService.getMessage( data.error.code );
                        ModalService.showModal(modal_title, modal_body);
                    }
                    else
                    {
                        // перенаправляем на главную страницу ЛК
                        user_promise = SocketService.getUserInfo();

                        user_promise
                            .then(function(data){
                                if( data.error !== undefined )
                                {
                                    //console.log('error: '); console.log(data);
                                    modal_title = 'Ошибка';
                                    modal_body = MessageService.getMessage( data.error.code );
                                    ModalService.showModal(modal_title, modal_body);
                                }
                                else {
                                    // данные получены
                                    // сохраним данные в глобальную переменную
                                    GlobalService.setUser(data.result, true);

                                    $rootScope.loggedIn = true;
                                    $rootScope.user = GlobalService.getUser();

                                    var group_promise = SocketService.getGroupInfo();
                                    group_promise
                                        .then(function (data) {
                                            if (data.error !== undefined) {
                                                console.log(data);
                                                if( data.error.code != 205 ) {
                                                    modal_title = 'Ошибка';
                                                    modal_body = MessageService.getMessage( data.error.code );
                                                    ModalService.showModal(modal_title, modal_body);
                                                }
                                            } else {
                                                GlobalService.setGroup(data.result);
                                            }

                                            $rootScope.group = GlobalService.getGroup();

                                        }, function (error) {
                                            modal_title = 'Ошибка';
                                            modal_body = MessageService.getMessage(error);
                                            ModalService.showModal(modal_title, modal_body);
                                        });

                                    $location.path('/dashboard/todo-list');
                                }
                            }, function(error){
                                // ошибка GetUserInfo
                               // console.log('GetUserInfo promise failed', error);
                                modal_title = 'Ошибка';
                                modal_body = MessageService.getMessage( error );
                                ModalService.showModal(modal_title, modal_body);
                            });

                    }

                }, function(error) {
                    // ошибка авторизации
                    //console.log('Auth promise failed', error);
                    modal_title = 'Ошибка';
                    modal_body = MessageService.getMessage( error );
                    ModalService.showModal(modal_title, modal_body);
                });
        };



        $scope.logoutUser = function(){
            var promise = SocketService.logout();

            promise
                .then(function(data){
                    if( data.error !== undefined ){
                        //console.log('error: '); console.log(data);
                        modal_title = 'Ошибка';
                        modal_body = MessageService.getMessage( data.error.code );
                        ModalService.showModal(modal_title, modal_body);
                    } else {
                        $rootScope.loggedIn = false;
                        GlobalService.setUser( null, false);

                        $location.path('/');
                    }
                }, function(error){
                    // ошибка авторизации
                    console.log('Logout promise failed', error);
                    modal_title = 'Ошибка';
                    modal_body = MessageService.getMessage( error.code );
                    ModalService.showModal(modal_title, modal_body);
                });





        }

        $scope.companySearchKeyUp = function(e){
            console.log(e);
            console.log(e.target.value.length);
            if( e.target.value.length > 3 ){
                var list = SocketService.getCompaniesList(e.target.value);
                console.log(list);
            }
        }

        $scope.showForgetPassModal = function(){
            var title = 'Восстановление пароля',
                body = '';

            ModalService.showModal( title, body, 'modalForgetPass');
        }
    }

}());
