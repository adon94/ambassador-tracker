angular.module('myApp').controller('complete', function ($scope, $location, $rootScope, $cookies, userService, toastr) {
    let self = this;
    $scope.gPlace;
    $scope.upload = true;
    $scope.cupload = true;

    let userId = $cookies.get('currentUser');

    if (userId != null) {
        userService.findOne(userId).then(function successCallback(response) {
            $rootScope.currentUser = response.data;
            self.user = angular.copy($rootScope.currentUser);
        });
    }

    self.saveProfile = function () {
        if (self.user.coverUrl != null && self.user.imageUrl != null && self.user.dob != null && self.user.male != null
            && self.user.phone != null && self.user.address != null) {
            userService.update(self.user).then(function successResponse(response) {
                $location.path("/")
            }, function errorCallback(response) {
                toastr.error('An unexpected error occurred', 'Error ' + response.status);
            })
        } else {
            toastr.error('All fields required to continue', 'Error');
        }
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

    $(".address").on('keyup', function (e) {
        if (e.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });

    $scope.fileSelected = function (element) {
        self.loading = true;
        let url = '/profileImages/';
        if (!self.main) {
            url = '/coverImages/'
        }

        let file = element.files[0];
        let storageRef = firebase.storage().ref('users/'+ $rootScope.currentUser.id +"/"+ file.name.replace(" ", ""));
        let state = storageRef.put(file);
        state.on('state_changed',
            function progress(snapshot) {
            },

            function error(err) {
            },

            function complete() {
                if(self.main) {
                    self.user.imageUrl = state.snapshot.downloadURL.toString();
                    console.log(self.user.imageUrl, ': is my new profiler');
                } else {
                    self.user.coverUrl = state.snapshot.downloadURL;
                    console.log(self.user.coverUrl, ': is my new cover');
                }
                self.loading = false;
            }
        );

    };

});