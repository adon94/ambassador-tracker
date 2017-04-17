angular.module('myApp').controller('complete', function ($scope, $location, $rootScope, $cookies, userService) {
    let self = this;
    $scope.gPlace;
    let user = {};

    let userId = $cookies.get('currentUser');

    if (userId != null) {
        userService.findOne(userId).then(function successCallback(response) {
            $rootScope.currentUser = response.data;
            self.user = angular.copy($rootScope.currentUser);
            updateData();
        });
    }

    let updateData = function () {
        if (self.user.imageUrl == null) {
            self.user.imageUrl = 'https://web.usask.ca/images/profile.jpg';
        }
    };

    self.saveProfile = function () {
        userService.create(self.user).then(function (response) {
            $location.path("/")
        })
    };

    self.onChange = function (newValue, oldValue) {

        if (newValue != null) {
            self.user.dob = newValue._d;
            console.log(newValue);
            calculateAge();
        }
    };

    let calculateAge = function() {
        let ageDifMs = Date.now() - new Date(self.user.dob);
        let ageDate = new Date(ageDifMs);
        self.age = Math.abs(ageDate.getUTCFullYear() - 1970);
    };

});