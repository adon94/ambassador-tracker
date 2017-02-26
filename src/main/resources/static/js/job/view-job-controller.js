angular.module('myApp').controller('view-job', function ($http, $scope, $filter, $location, $routeParams, $rootScope, $cookies, jobService) {

    var self = this;
    var id = $routeParams.id;

    $rootScope.authenticated = $cookies.get('authenticated');
    $rootScope.empUser = ($cookies.get('empUser') === 'true');
    $rootScope.currentUser = JSON.parse($cookies.get('currentUser'));

    self.currentUser = $rootScope.currentUser;
    self.empUser = $rootScope.empUser;

    self.curInvited = false;
    self.curAccepted = false;
    self.curDeclined = false;

    $http.get('/job/view/'+id).then(function (response) {
        self.job = response.data;
        self.dateMade = new Date(self.job.createdAt);

        if(!self.empUser && self.currentUser != null){
            angular.forEach(self.job.invited, function(value) {
                if(self.currentUser.id == value.id) {
                    self.curInvited = true;
                }
            });
            if(!self.curInvited){
                angular.forEach(self.job.accepted, function(value) {
                    if(self.currentUser.id == value.id) {
                        self.curAccepted = true;
                    }
                });
                if (!self.curAccepted){
                    angular.forEach(self.job.declined, function(value) {
                        if(self.currentUser.id == value.id) {
                            self.curDeclined = true;
                        }
                    });
                }
            }
        }

        self.acceptJob = function () {
            jobService.acceptJob(self.job).then(function (response) {
                if(response.status == 200){
                    console.log("Success");
                } else {
                    console.log(response.status);
                }
            });
        };

        self.declineJob = function () {
            jobService.declineJob(self.job).then(function (response) {
                if(response.status == 200){
                    console.log("Success");
                } else {
                    console.log(response.status);
                }
            });
        }
    });
});