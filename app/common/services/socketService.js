(function(){
    "use strict";

    angular.module('common.services').factory('SocketService', ['$q', '$rootScope', function($q, $rootScope) {
        var JTROS_VERSION = '1.0';
        // We return this object to anything injecting our service
        var Service = {};
        // Keep all pending requests here until they get responses
        var callbacks = {};
        // Create a unique callback ID to map requests to responses
        var currentCallbackId = 0;
        // Create our websocket object with the address to the websocket
        var ws = new WebSocket("ws://10.10.1.17:8081/jtros");

        ws.onopen = function(){
            console.log("Socket has been opened!");
        };

        ws.onclose = function(){
            console.log('Socket has been closed!')
        };

        ws.onmessage = function(message) {
            listener(JSON.parse(message.data));
        };

        function sendRequest(request) {
            var defer = $q.defer();
            var callbackId = getCallbackId();
            callbacks[callbackId] = {
                time: new Date(),
                cb:defer
            };
            request.key = callbackId;
            request.jtros = JTROS_VERSION;
            //console.log('Sending request', request);
            //console.log(ws);
            if (ws.readyState != 0){
                ws.send(JSON.stringify(request));
            }
            else {
                console.log('Socket not ready.');
                ws.reconnect();
            }
            return defer.promise;
        }

        function listener(data) {
            var messageObj = data;
           // console.log("Received data from websocket: ", messageObj);
            // If an object exists with callback_id in our callbacks object, resolve it
            if(callbacks.hasOwnProperty(messageObj.key)) {
               // console.log(callbacks[messageObj.key]);
                $rootScope.$apply(callbacks[messageObj.key].cb.resolve(messageObj.data));
                delete callbacks[messageObj.key];
            }
        }

        // This creates a new callback ID for a request
        function getCallbackId() {
            currentCallbackId += 1;
            if(currentCallbackId > 10000) {
                currentCallbackId = 0;
            }
            return currentCallbackId;
        }

        /*---- User Function ----*/

        // Authorization
        Service.authorize = function(login, pass){
            var request = {
                "type": "Signin",
                "data": {
                    "login": login,
                    "password": pass
                }
            };

            var promise = sendRequest(request);
            return promise;
        };

        Service.logout = function(){
            var request = {
                "type": "Signout"
            };

            var promise = sendRequest(request); //ws.close();
            return promise;
        };



        // GetUserInfo
        Service.getUserInfo = function(){
            var request = {
                "type": "GetUserInfo"
            };

            var promise = sendRequest(request);
            return promise;
        };

        // Save User Profile
        Service.setUserAttributes = function(user){ console.log(user);
            var request = {
                "type": "SetUserAttributes",
                "data": {
                    'languageCode': user.attr.language,
                    'userAttributes': {
                        'name': user.attr.userAttributes.name,
                        'surname': user.attr.userAttributes.surname,
                        'appeal': user.attr.userAttributes.appeal,
                        'position': user.attr.userAttributes.position,
                        'comments': user.attr.userAttributes.comments
                    }
                }
            };

            var promise = sendRequest(request);
            return promise;
        };

        // create new user
        Service.createUser = function(user){
            var request = {
                "type": 'CreateUser',
                'data': {
                    'login': user.login,
                    'password': user.password,
                    'languageCode': user.language,
                    'userAttributes': {
                        'name': user.name,
                        'surname': user.surname,
                        'appeal': user.appeal,
                        'position': user.position,
                        'language': user.language,
                        'comments': user.comments
                    }
                }
            };

            var promise = sendRequest(request);
            return promise;
        };

        /*---- Group functions ----*/

        // Get group info
        Service.getGroupInfo = function(){
            var request = {
                "type": "GetGroupInfo"
            };

            var promise = sendRequest(request);
            return promise;
        };

        // Get groups list by search string
        Service.getCompaniesList = function(str){
            var request = {
                "type": 'FindGroups',
                'data': {
                    'pattern': str,
                    'maxResultItems': 10,
                    'statuses': ['ACTIVE']
                }
            };

            var promise = sendRequest(request);
            return promise;
        };

        // create group
        Service.createGroup = function(company){
            var request = {
                "type": 'CreateGroup',
                'data': {
                    'groupName': company.name,
                    'groupAttributes': {
                        'legalCountry': company.groupAttributes.legalCountry,
                        'legalProvince': company.groupAttributes.legalProvince,
                        'legalCity': company.groupAttributes.legalCity,
                        'legalPostalCode': company.groupAttributes.legalPostalCode,
                        'legalAddress': company.groupAttributes.legalAddress,
                        'actualCountry': company.groupAttributes.actualCountry,
                        'actualProvince': company.groupAttributes.actualProvince,
                        'actualCity': company.groupAttributes.actualCity,
                        'actualPostalCode': company.groupAttributes.actualPostalCode,
                        'actualAddress': company.groupAttributes.actualAddress,
                        'phone': company.groupAttributes.phone,
                        'chiefName': company.groupAttributes.chiefName,
                        'chiefSurname': company.groupAttributes.chiefSurname,
                        'chiefAppeal': company.groupAttributes.chiefAppeal,
                        'site': company.groupAttributes.site,
                        'staffAmount': company.groupAttributes.staffAmount,
                        'logo': company.groupAttributes.logo,
                        'latitude': company.groupAttributes.latitude,
                        'longitude': company.groupAttributes.longitude,
                        'comments': company.groupAttributes.comments
                    }

                }
            };

            var promise = sendRequest(request);
            return promise;
        };

        // сохраняем изменения компании
        Service.saveGroup = function(company){
            var request = {
                "type": 'SetGroupAttributes',
                'data': {
                    'groupName': company.name,
                    'groupAttributes': {
                        'legalCountry': company.groupAttributes.legalCountry,
                        'legalProvince': company.groupAttributes.legalProvince,
                        'legalCity': company.groupAttributes.legalCity,
                        'legalPostalCode': company.groupAttributes.legalPostalCode,
                        'legalAddress': company.groupAttributes.legalAddress,
                        'actualCountry': company.groupAttributes.actualCountry,
                        'actualProvince': company.groupAttributes.actualProvince,
                        'actualCity': company.groupAttributes.actualCity,
                        'actualPostalCode': company.groupAttributes.actualPostalCode,
                        'actualAddress': company.groupAttributes.actualAddress,
                        'phone': company.groupAttributes.phone,
                        'chiefName': company.groupAttributes.chiefName,
                        'chiefSurname': company.groupAttributes.chiefSurname,
                        'chiefAppeal': company.groupAttributes.chiefAppeal,
                        'site': company.groupAttributes.site,
                        'staffAmount': company.groupAttributes.staffAmount,
                        'logo': company.groupAttributes.logo,
                        'latitude': company.groupAttributes.latitude,
                        'longitude': company.groupAttributes.longitude,
                        'comments': company.groupAttributes.comments
                    }

                }
            };

            var promise = sendRequest(request);
            return promise;
        }

        Service.joinGroup = function(group_id){
            var request = {
                "type": 'JoinGroup',
                'data': {
                    'groupID': group_id
                }
            };

            var promise = sendRequest(request);
            return promise;
        }

        Service.cancelRequest = function(type){
            var request = {
                "type": ( type == 'join' ? 'CancelJoinGroup' : 'CancelCreateGroup')
            };

            var promise = sendRequest(request);
            return promise;
        }

        return Service;
    }]);

}());