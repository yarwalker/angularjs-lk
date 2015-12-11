(function(){
    'use strict';
    var app = angular.module('proApp', [
        "common.services",
        "ui.router",
        //"ui.mask",
        "ui.bootstrap",
        "ngCookies",
        "udpCaptcha",
        'ui.autocomplete',
        'angularFileUpload'
    ]);

    // инициализация юзера по умолчанию
    //app.value('user', {result: {}, logged_in: false});

    // инициализация настроек сайта
    app.value('site', {
        lang: 'en',
        menu: ''
    });

    //app.value('user', {});

    /*app.value( 'modal', {
        title: '',
        body: '',
        show: false
    });*/

   /* app.value('errors', {
        'auth': {
            100: 'Некорректный логин/пароль.',
            301: 'Группа заблокирована.',
            302: 'Пользователь заблокирован.'
        }
    }); */


    app.config(
        ['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider){
            $urlRouterProvider.otherwise("/");

            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'views/loginView.html',
                    controller: 'CabinetController'
                })

                .state('dashboard', {
                   // abstract: true,
                    url: '/dashboard',
                    templateUrl: 'views/dashboardView.html',
                    controller: 'CabinetController'
                })

                .state("dashboard.todo-list", {
                    url: "/todo-list",
                    templateUrl: "views/todoListView.html"
                })

                .state("dashboard.profile", {
                    url: "/profile",
                    templateUrl: "views/profileView.html",
                    controller: 'UserController'
                })

                .state("dashboard.company", {
                    url: "/company",
                    templateUrl: "views/companyView.html",
                    controller: 'CompanyController'
                })

               /* .state("dashboard.company.joincompany", {
                    url: "/joincompany",
                    templateUrl: "views/partials/joinCompanyTabContent.html",
                    controller: 'CompanyController'
                })

                .state("dashboard.company.createcompany", {
                    url: "/createcompany",
                    templateUrl: "views/partials/createCompanyTabContent.html",
                    controller: 'CompanyController'
                })*/

                .state("register", {
                    url: "/register",
                    templateUrl: "views/registerView.html",
                    controller: 'UserController'
                })

          }
      ]
    );



}());


