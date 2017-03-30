angular.module('myApp').controller('account', function($rootScope, $cookies, $location, toastr, userService) {

    let self = this;
    self.user = {};

    let userId = $cookies.get('currentUser');
    if(userId != null) {
        userService.findOne(userId).then(function successCallback(response) {
            $rootScope.currentUser = response.data;
            self.user = $rootScope.currentUser;
            if (self.user.male) {
                self.gender = 'Male';
            } else {
                self.gender = 'Female'
            }
        });
    }

    self.editImageUrl = false;
    self.editCoverUrl = false;
    self.editEmail = false;
    self.editPassword = false;
    self.editFirstName = false;
    self.editLastName = false;
    self.editGender = false;
    self.editDob = false;
    self.editPhone = false;
    self.editAddress = false;
    self.editFullLicence = false;
    self.editOwnCar = false;

    self.updateUser = function () {
        if (self.dob != null) {
            self.user.dob = self.dob._d;
        }

        self.user.male = self.gender == 'Male';

        userService.create(self.user).then(function successCallback(response) {
            $cookies.put('currentUser', response.data.id);
            $rootScope.currentUser = response.data;
            self.user = $rootScope.currentUser;
            toastr.success('User details updated');
        })
    }

});