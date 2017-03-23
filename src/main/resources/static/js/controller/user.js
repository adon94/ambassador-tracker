angular.module('myApp').controller('user', function ($http, $scope, $filter, $location, $rootScope, $cookies) {
    let self = this;
    let user = {};
    self.userType = false;

    $rootScope.authenticated = $cookies.get('authenticated');
    // $rootScope.empUser = ($cookies.get('empUser') === 'true');
    // $rootScope.currentUser = JSON.parse($cookies.get('currentUser'));

    self.createUser = function () {
        let url = "/employee/create";

        user.password = self.user.password;
        user.email = self.user.email;
        user.firstName = self.user.firstName;
        user.lastName = self.user.lastName;
        user.phone = self.user.phone;
        user.imageUrl = self.user.imageUrl;

        if(self.userType){
            url = "/ba/create";
            user.dob = self.user.dob._d;
            user.address = self.user.address;
            user.male = self.user.male;
            user.fullLicence = self.user.fullLicence;
            user.carOwner = self.user.carOwner;
            user.height = self.user.height;
            user.torso = self.user.torso;
            user.waist = self.user.waist;
            user.shoe = self.user.shoe;
        }
        console.log(user);
        console.log(url);
        $http.post(url, user).then(function (response) {
            console.log(response);
            console.log(response.status);
            if(response.status == 200){
                console.log("SDfscds");
                $location.path("/");
                $rootScope.authenticated = true;
            }
        });
    };

    // $scope.upload = function (dataUrl, name) {
    //     Upload.upload({
    //         url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
    //         data: {
    //             file: Upload.dataUrltoBlob(dataUrl, name)
    //         },
    //     }).then(function (response) {
    //         $timeout(function () {`
    //             $scope.result = response.data;
    //         });
    //     }, function (response) {
    //         if (response.status > 0) $scope.errorMsg = response.status
    //             + ': ' + response.data;
    //     }, function (evt) {
    //         $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
    //     });
    // }

});
