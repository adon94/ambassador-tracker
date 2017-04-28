angular.module('myApp').controller('login', function($rootScope, $location, $route, $cookies, toastr, userService) {

    let self = this;
    self.user = {};
    self.new = {};

    let userId = $cookies.get('currentUser');
    if(userId != null) {
        userService.findOne(userId).then(function successCallback(response) {
            $rootScope.currentUser = response.data;
            self.user = $rootScope.currentUser;
        });
    }

    self.createUser = function () {
        if(self.new.firstName != null && self.new.lastName != null && self.new.email != null &&
            self.new.password != null && self.newPassword2 != null && self.new.registrationCode != null) {
            if (self.new.password.length > 4) {
                if (self.new.password == self.newPassword2) {
                    userService.create(self.new).then(function (response) {
                        if (response.status == 200) {
                            $cookies.put('currentUser', response.data.id);
                            $rootScope.currentUser = response.data;
                            $location.path("/complete");
                            toastr.success('Logged in as ' + response.data.firstName, 'Welcome');
                        }
                    })
                } else {
                    toastr.warning('Passwords do not match');
                }
            } else {
                toastr.warning('Password must be at least 5 characters in length');
            }
        } else {
            toastr.warning('Please fill out all fields');
        }
    };

    self.login = function () {
        if(self.user.password != null && self.user.email != null) {
            userService.login(self.user).then(function successCallback(response) {
                $cookies.put('currentUser', response.data.id);
                $rootScope.currentUser = response.data.id;
                $location.path("/");
                console.log(response.data);
                toastr.success('Logged in as ' + response.data.firstName, 'Welcome back');
            }, function errorCallback(response) {
                if(response.status == 401) {
                    toastr.error('Incorrect email or password', 'Error');
                } else if (response.status = 404) {
                    toastr.error('User not found', 'Error');
                } else {
                    toastr.error('An unexpected error occurred', 'Error');
                }
            })
        }
    };
});