angular.module('myApp').controller('generate', function ($scope, $location, $rootScope, $cookies, userService) {
    let self = this;
    let user = {};

    let userId = $cookies.get('currentUser');

    if (userId != null) {
        userService.findOne(userId).then(function successCallback(response) {
            $rootScope.currentUser = response.data;
            user = $rootScope.currentUser;
        });
    }

    self.user = {};
    self.user.manager = false;

    self.generate = function () {
        console.log(self.user);
        userService.generate(self.user).then(function (response) {
            self.userCode = response.data.registrationCode;
        })
    }

});