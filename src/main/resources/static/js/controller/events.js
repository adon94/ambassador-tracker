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

        if (!user.manager) {
            jobService.getAcceptedJobs(user.id).then(function (response) {
                self.acceptedJobs = response.data;
            });

            jobService.getInvitedJobs(user.id).then(function (response) {
                self.invitedJobs = response.data;
            });
        } else {
            jobService.getEmployeesJobs(user.id).then(function (response) {
                self.myJobs = response.data;
            });
        }
    };

    self.filterChange = function () {
        if (self.eventFilter == "all") {
            self.events = self.allJobs;
        } else if (self.eventFilter == "accepted") {
            self.events = self.acceptedJobs;
        } else if (self.eventFilter == "invited") {
            self.events = self.invitedJobs;
        } else if (self.eventFilter == "myEvents") {
            self.events = myJobs;
        }
    };

    self.afterFilterDate = null;

    self.afterDateSelect = function (newValue, oldValue) {
        console.log(self.afterMoment);
        console.log(newValue);
        self.afterFilterDate = newValue._d;
    };

    self.beforeFilterDate = 'Fri Dec 31 2100 00:00:00 GMT+0000 (GMT Standard Time)';

    self.beforeDateSelect = function (newValue, oldValue) {
        console.log(self.beforeMoment);
        console.log(newValue);
        self.beforeFilterDate = newValue._d;
    };

    self.publicFilter = function(e) {
        if (self.publicEventsOnly == true) {
            return e.publicEvent;
        } else {
            return true;
        }
    };
});