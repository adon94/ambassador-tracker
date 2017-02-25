angular.module('myApp').controller('navigation', function($rootScope, $http, $location, $route, $cookies) {

        var self = this;

        self.tab = function(route) {
            return $route.current && route === $route.current.controller;
        };

        var authenticate = function(credentials, callback) {
            // var headers = credentials ? {
            //         authorization : "Basic "
            //         + btoa(credentials.username + ":"
            //             + credentials.password)
            //     } : {};

            $http.post('/employee/login', credentials).then(function successCallback(response) {
                if(response.status == 200){
                    // $rootScope.authenticated = true;
                    $cookies.put('authenticated', true);
                    // $rootScope.currentUser = response.data;
                    console.log(JSON.stringify(response.data));
                    $cookies.put('currentUser', JSON.stringify(response.data));
                    // $rootScope.empUser = true;
                    $cookies.put('empUser', true);
                    $location.path("/");
                }
            }, function errorCallback(response) {
                if (response.status = 404) {
                    console.log("^ignore");
                    $http.post('/ba/login', credentials).then(function successCallback(response) {
                        if (response.status == 200) {
                            // $rootScope.authenticated = true;
                            $cookies.put('authenticated', true);
                            // $rootScope.currentUser = response.data;
                            $cookies.put('currentUser', JSON.stringify(response.data));
                            // $rootScope.empUser = false;
                            $cookies.put('empUser', false);
                            $location.path("/");
                        }
                    }, function errorCallback(response) {
                        console.log("Invalid credentials" + response.status);
                    });
                }
            });
        };

        self.credentials = {};
        self.login = function() {
            authenticate(self.credentials, function(authenticated) {
                if ($cookies.get('authenticated')) {
                    console.log("Login succeeded");
                    $location.path("/");
                    self.error = false;
                    $rootScope.authenticated = $cookies.get('authenticated');
                    $rootScope.empUser = ($cookies.get('empUser') === 'true');
                } else {
                    console.log("Login failed");
                    $location.path("/login");
                    self.error = true;
                }
            })
        };

        $rootScope.logout = function() {
            // $http.post('logout', {}).finally(function() {
            console.log("logging out...");
            $cookies.remove('authenticated');
            $cookies.remove('currentUser');
            $cookies.remove('empUser');
            $rootScope.authenticated = false;
            $rootScope.currentUser = null;
            $rootScope.empUser = null;
            $location.path("/#/login");
            // });
        }

    });