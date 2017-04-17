angular.module('myApp').controller('events', function($rootScope, $cookies, $location, $interval, userService, jobService) {

    let self = this;
    let user = {};
    let userId = $cookies.get('currentUser');
    self.eventFilter = "all";
    if (userId != null) {
        userService.findOne(userId).then(function successCallback(response) {
            $rootScope.currentUser = response.data;
            user = $rootScope.currentUser;
            updateData();
        });
    }

    let updateData = function () {
        jobService.getAllJobs().then(function (response) {
            self.allJobs = response.data;
            self.events = self.allJobs;
        });

        jobService.getAcceptedJobs(user.id).then(function (response) {
            self.acceptedJobs = response.data;
        });

        jobService.getInvitedJobs(user.id).then(function (response) {
            self.invitedJobs = response.data;
        });
    };

    self.filterChange = function () {
        if (self.eventFilter == "all") {
            self.events = self.allJobs;
        } else if (self.eventFilter == "accepted") {
            self.events = self.acceptedJobs;
        } else if (self.eventFilter == "invited") {
            self.events = self.invitedJobs;
        }
    }

});