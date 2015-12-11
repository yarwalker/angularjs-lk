(function(){
    'use strict';

    angular
        .module('proApp')
        .controller('CompanyController', [ '$scope', '$rootScope', '$cookies', '$location', 'GlobalService', 'SocketService', 'ModalService', 'MessageService',
            "$captcha", "countryResource", "cityResource", "FileUploader",
            CompanyController]);

    function CompanyController( $scope, $rootScope, $cookies, $location, GlobalService, SocketService, ModalService, MessageService,
                                $captcha, countryResource, cityResource, FileUploader ){
        var modal_title, modal_body;

        if( $cookies.get('loggedin') !== 'undefined' && $cookies.get('loggedin') == 'true' ) {
            $scope.company = GlobalService.getGroup();

            // загрузка картинок
            var uploader = $scope.uploader = new FileUploader({
                url: 'upload.php'
            });

            // FILTERS
            uploader.filters.push({
                name: 'customFilter',
                fn: function(item /*{File|FileLikeObject}*/, options) {
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                }
            });

            // CALLBACKS
            uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
                console.info('onWhenAddingFileFailed', item, filter, options);
            };
            uploader.onAfterAddingFile = function(fileItem) {
                console.info('onAfterAddingFile', fileItem);
            };
            uploader.onAfterAddingAll = function(addedFileItems) {
                console.info('onAfterAddingAll', addedFileItems);
            };
            uploader.onBeforeUploadItem = function(item) {
                console.info('onBeforeUploadItem', item);
            };
            uploader.onProgressItem = function(fileItem, progress) {
                console.info('onProgressItem', fileItem, progress);
            };
            uploader.onProgressAll = function(progress) {
                console.info('onProgressAll', progress);
            };
            uploader.onSuccessItem = function(fileItem, response, status, headers) {
                console.info('onSuccessItem', fileItem, response, status, headers);
                $scope.company.groupAttributes.logo = 'uploads/' + fileItem.file.name;
            };
            uploader.onErrorItem = function(fileItem, response, status, headers) {
                console.info('onErrorItem', fileItem, response, status, headers);
            };
            uploader.onCancelItem = function(fileItem, response, status, headers) {
                console.info('onCancelItem', fileItem, response, status, headers);
            };
            uploader.onCompleteItem = function(fileItem, response, status, headers) {
                console.info('onCompleteItem', fileItem, response, status, headers);
                $scope.company.groupAttributes.logo = 'uploads/' + fileItem.file.name;
            };
            uploader.onCompleteAll = function() {
                console.info('onCompleteAll');
            };

        } else {
            // пенеаправляем на авторизацию
            $location.path('/');
        }

        // получаем список компаний по строке поиска
        $scope.companySearchKeyUp = function (e) {
            //console.log(e);
            //console.log(e.target.value.length);
            if ( e.target.value.length > 3 ) {
                var promise = SocketService.getCompaniesList(e.target.value);

                promise
                    .then(function(data){
                        // данные получены

                        if( data.error !== undefined ){
                            console.log('error: '); console.log(data);
                            modal_title = 'Ошибка';
                            modal_body = MessageService.getMessage( data.error.code );
                            ModalService.showModal(modal_title, modal_body, null);
                        } else {
                            // передаем найденные компании в представление
                            $scope.groups = data.result;
                        }
                    }, function(error){
                        // ошибка GetUserInfo
                        console.log('GetUserInfo promise failed', error);
                        modal_title = 'Ошибка';
                        modal_body = MessageService.getMessage(data.error.code);
                        ModalService.showModal(modal_title, modal_body, null);
                    });
            }
        };

        // заполняем фактический адрес компании юридическим
        $scope.checkSameAddress = function(company) {
            if (company.sameAddress === true) {
                company.groupAttributes.actualCountry = company.groupAttributes.legalCountry;
                company.groupAttributes.actualProvince = company.groupAttributes.legalProvince;
                company.groupAttributes.actualCity = company.groupAttributes.legalCity;
                company.groupAttributes.actualPostalCode = company.groupAttributes.legalPostalCode;
                company.groupAttributes.actualAddress = company.groupAttributes.legalAddress;
            } else {
                company.groupAttributes.actualCountry = '';
                company.groupAttributes.actualProvince = '';
                company.groupAttributes.actualCity = '';
                company.groupAttributes.actualPostalCode = '';
                company.groupAttributes.actualAddress = '';
            }
        };

        // создаем компании
        $scope.submitCompanyRegForm = function(company) {
            console.log(company);
            var promise = SocketService.createGroup(company);

            promise
                .then(function(data){
                    // данные получены
                    console.log(data);

                    if( data.error !== undefined ){
                        console.log('error: '); console.log(data);
                        modal_title = 'Ошибка';
                        modal_body = MessageService.getMessage( data.error.code );
                        ModalService.showModal(modal_title, modal_body, null);
                    } else {
                        // сохраним данные в глобальную переменную
                        console.log(data);

                        // выводим сообщение об отправленной заявке на создание
                        modal_title = 'Сообщение';
                        modal_body = MessageService.getMessage( 1004 );
                        ModalService.showModal(modal_title, modal_body, null);

                        var group_promise = SocketService.getGroupInfo();
                        group_promise
                            .then(function (data) {
                                if (data.error !== undefined) {
                                    console.log(data);
                                    modal_title = 'Ошибка';
                                    modal_body = MessageService.getMessage( data.error.code );
                                    ModalService.showModal(modal_title, modal_body, null);
                                } else {
                                    GlobalService.setGroup(data.result);
                                }

                                $rootScope.group = GlobalService.getGroup();

                            }, function (error) {
                                modal_title = 'Ошибка';
                                modal_body = MessageService.getMessage(error);
                                ModalService.showModal(modal_title, modal_body, null);
                            });

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
                                ModalService.showModal(modal_title, modal_body, null);
                            });

                        $rootScope.user = GlobalService.getUser();
                    }
                }, function(error){
                    // ошибка GetUserInfo
                    console.log('GetUserInfo promise failed', error);
                    modal_title = 'Ошибка';
                    modal_body = MessageService.getMessage(data.error.code);
                    ModalService.showModal(modal_title, modal_body, null);
                });
        };

        // сохраняем данные компании
        $scope.submitCompanyEditForm =function(company){
            console.log(company);
            var promise = SocketService.saveGroup(company);

            promise
                .then(function(data){
                    // данные получены
                    console.log(data);

                    if( data.error !== undefined ){
                        console.log('error: '); console.log(data);
                        modal_title = 'Ошибка';
                        modal_body = MessageService.getMessage( data.error.code );
                        ModalService.showModal(modal_title, modal_body, null);
                    } else {
                        // сохраним данные в глобальную переменную
                        console.log(data);

                        // выводим сообщение о сохранении данных компании
                        modal_title = 'Сообщение';
                        modal_body = MessageService.getMessage( 1005 );
                        ModalService.showModal(modal_title, modal_body, null);

                        var group_promise = SocketService.getGroupInfo();
                        group_promise
                            .then(function (data) {
                                if (data.error !== undefined) {
                                    console.log(data);
                                    modal_title = 'Ошибка';
                                    modal_body = MessageService.getMessage( data.error.code );
                                    ModalService.showModal(modal_title, modal_body, null);
                                } else {
                                    GlobalService.setGroup(data.result);
                                }

                                $rootScope.group = GlobalService.getGroup();

                            }, function (error) {
                                modal_title = 'Ошибка';
                                modal_body = MessageService.getMessage(error);
                                ModalService.showModal(modal_title, modal_body, null);
                            });
                    }
                }, function(error){
                    // ошибка GetUserInfo
                    console.log('SetGroupAttributes promise failed', error);
                    modal_title = 'Ошибка';
                    modal_body = MessageService.getMessage(data.error.code);
                    ModalService.showModal(modal_title, modal_body, null);
                });
        };

        // присоединяем компанию
        $scope.joinGroup = function(group) {
            var group_id, group_name;
            var res = group.split('#');

            group_id = res[0];
            group_name = res[1];

            var promise = SocketService.joinGroup(group_id);

            promise
                .then(function(data){
                    // данные получены

                    if( data.error !== undefined ){
                        console.log('error: ');
                        modal_title = 'Ошибка';
                        modal_body = MessageService.getMessage( data.error.code );
                        ModalService.showModal(modal_title, modal_body, null);
                    } else {
                        // выводим сообщение об отправленной заявке на присоединение
                        modal_title = 'Сообщение';
                        modal_body = MessageService.getMessage( 1000 );
                        ModalService.showModal(modal_title, modal_body, null);

                        //$scope.group.name = group_name;

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
                                ModalService.showModal(modal_title, modal_body, null);
                            });

                        $scope.user = GlobalService.getUser();

                        var group_promise = SocketService.getGroupInfo();
                        group_promise
                            .then(function (data) { console.log(data);
                                if (data.error !== undefined) {
                                    console.log(data);
                                    if( data.error.code != 205 ) {
                                        modal_title = 'Ошибка';
                                        modal_body = MessageService.getMessage( data.error.code );
                                        ModalService.showModal(modal_title, modal_body, null);
                                    }
                                } else {
                                    GlobalService.setGroup(data.result);
                                }

                                $rootScope.group = GlobalService.getGroup();

                            }, function (error) {
                                modal_title = 'Ошибка';
                                modal_body = MessageService.getMessage(error);
                                ModalService.showModal(modal_title, modal_body, null);
                            });
                    }
                }, function(error){
                    // ошибка GetUserInfo
                    console.log('GetUserInfo promise failed', error);
                    modal_title = 'Ошибка';
                    modal_body = MessageService.getMessage(data.error.code);
                    ModalService.showModal(modal_title, modal_body, null);
                });


        };

        // отмена запроса на присоединение/создание компании
        $scope.cancelRequest = function(type){

            var promise = SocketService.cancelRequest(type);

            promise
                .then(function(data){
                    // данные получены

                    if( data.error !== undefined ){
                        console.log('error: '); console.log(data);
                        modal_title = 'Ошибка';
                        modal_body = MessageService.getMessage( data.error.code );
                        ModalService.showModal(modal_title, modal_body, null);
                    } else {

                        console.log(data);
                        // выводим сообщение об успешной отмене запроса
                        modal_title = 'Сообщение';
                        modal_body = MessageService.getMessage( type == 'join' ? 1001 : 1002 );
                        ModalService.showModal(modal_title, modal_body, null);

                        // обнуляем список компаний (поиск для присоединения)
                        $scope.groups = {};

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
                                ModalService.showModal(modal_title, modal_body, null);
                            });

                        $scope.user = GlobalService.getUser();

                        GlobalService.setGroup({});
                        $rootScope.group = GlobalService.getGroup();

                    }
                }, function(error){
                    // ошибка GetUserInfo
                    console.log('GetUserInfo promise failed', error);
                    modal_title = 'Ошибка';
                    modal_body = MessageService.getMessage(data.error.code);
                    ModalService.showModal(modal_title, modal_body, null);
                });
        }

        var country_id;
        // формируем список стран для autocomplete
        $scope.legalCountry = {
            options: {
                html: true,
                focusOpen: true,
                onlySelectValid: true,
                source: function (request, response) {
                    var array = [];

                    var promise = countryResource.get().$promise;

                    promise
                        .then(function(data) {
                            var countries = data.country,
                                i;

                            for (i = 0; i < countries.length; i++) {
                                //console.log(countries[i].id + ' - ' + countries[i].name_ru);
                                array.push({ value: countries[i].name_ru, id: countries[i].id });
                            }

                            array = $scope.legalCountry.methods.filter(array, request.term);

                            if (!array.length) {
                                array.push({
                                    label: 'not found',
                                    value: ''
                                });
                            }
                            // add "Add Language" button to autocomplete menu bottom
                            /*data.push({
                             label: $compile('<a class="btn btn-link ui-menu-add" ng-click="addLanguage()">Add Language</a>')($scope),
                             value: ''
                             }); */
                            response(array);
                        });


                }
            },
            methods: {},
            events: {
                change: function( event, ui ) {
                    country_id = ui.item.id;

                    /*$scope.legalCity = {
                        options: {
                            html: true,
                            focusOpen: true,
                            onlySelectValid: true,
                            source: function (request, response) {
                                var array = [];

                                var promise = cityResource.get().$promise;
                                console.log(promise);
                                promise
                                    .then(function(data) { console.log(data);
                                        var cities = data.city,
                                            i;

                                        for (i = 0; i < cities.length; i++) {
                                            //console.log(countries[i].id + ' - ' + countries[i].name_ru);
                                            if( cities[i].country_id == country_id ) {
                                                array.push({ value: cities[i].name_ru, id: cities[i].id });
                                            }

                                        }

                                        array = $scope.legalCity.methods.filter(array, request.term);

                                        if (!array.length) {
                                            array.push({
                                                label: 'not found',
                                                value: ''
                                            });
                                        }

                                        response(array);
                                    });


                            }
                        },
                        methods: {}
                    };*/
                },
            }
        };
        // формируем список городов для autocomplete
        $scope.legalCity = {
            options: {
                html: true,
                focusOpen: true,
                onlySelectValid: true,
                source: function (request, response) {
                    var array = [];

                    var promise = cityResource.get().$promise;

                    promise
                        .then(function(data) {
                            var cities = data.city,
                                i;

                            for (i = 0; i < cities.length; i++) {
                                if( cities[i].country_id == country_id ) {
                                    array.push({ value: cities[i].name_ru, id: cities[i].id });
                                }
                            }

                            array = $scope.legalCity.methods.filter(array, request.term);

                            if (!array.length) {
                                array.push({
                                    label: 'not found',
                                    value: ''
                                });
                            }

                            response(array);
                        });
                }
            },
            methods: {}
        };

        // формируем список стран для autocomplete
        $scope.actualCountry = {
            options: {
                html: true,
                focusOpen: true,
                onlySelectValid: true,
                source: function (request, response) {
                    var array = [];

                    var promise = countryResource.get().$promise;

                    promise
                        .then(function(data) {
                            var countries = data.country,
                                i;

                            for (i = 0; i < countries.length; i++) {
                                array.push({ value: countries[i].name_ru, id: countries[i].id });
                            }

                            array = $scope.actualCountry.methods.filter(array, request.term);

                            if (!array.length) {
                                array.push({
                                    label: 'not found',
                                    value: ''
                                });
                            }
                            // add "Add Language" button to autocomplete menu bottom
                            /*data.push({
                             label: $compile('<a class="btn btn-link ui-menu-add" ng-click="addLanguage()">Add Language</a>')($scope),
                             value: ''
                             }); */
                            response(array);
                        });


                }
            },
            methods: {},
            events: {
                change: function( event, ui ) {
                    country_id = ui.item.id;
                },
            }
        };
        // формируем список городов для autocomplete
        $scope.actualCity = {
            options: {
                html: true,
                focusOpen: true,
                onlySelectValid: true,
                source: function (request, response) {
                    var array = [];

                    var promise = cityResource.get().$promise;

                    promise
                        .then(function(data) {
                            var cities = data.city,
                                i;

                            for (i = 0; i < cities.length; i++) {
                                if( cities[i].country_id == country_id ) {
                                    array.push({ value: cities[i].name_ru, id: cities[i].id });
                                }
                            }

                            array = $scope.actualCity.methods.filter(array, request.term);

                            if (!array.length) {
                                array.push({
                                    label: 'not found',
                                    value: ''
                                });
                            }

                            response(array);
                        });
                }
            },
            methods: {}
        };
    }

}());