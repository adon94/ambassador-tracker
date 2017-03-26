angular.module('myApp').controller('profile', function ($rootScope, $cookies, $timeout, $filter, $location, $routeParams, jobService, userService) {

    let self = this;
    let id = $routeParams.id;
    let user = {};

    let userId = $cookies.get('currentUser');
    if(userId != null) {
        userService.findOne(userId).then(function successCallback(response) {
            $rootScope.currentUser = response.data;
            user = $rootScope.currentUser;
        });
    }

    userService.findOne(id).then(function successCallback(response) {
        self.profile = response.data;
        updateData();
    });

    let updateData = function () {

        if (self.profile.imageUrl == null) {
            self.profile.imageUrl = 'https://web.usask.ca/images/profile.jpg';
        }

        if (self.profile.dob != null) {
            calculateAge();
        }

        if (!self.profile.manager) {

            jobService.getInvitedJobs(id).then(function (response) {
                self.main = response.data;

                angular.forEach(self.main, function (value, key) {
                    self.main[key].startDate = new Date(value.startDate)
                });
            });

            self.side = [];

            jobService.getAcceptedJobs(id).then(function (response) {
                self.accepted = response.data;

                angular.forEach(self.accepted, function (value, key) {

                    self.accepted[key].startDate = new Date(value.startDate);

                    if (self.accepted[key].startDate - Date.now() > 0) {
                        console.log(self.accepted[key].client);
                        self.side.push(self.accepted[key]);
                    }

                });
            });

        } else {
            self.main = [];
            self.side = [];

            jobService.getEmployeesJobs(id).then(function (response) {
                self.created = response.data;

                angular.forEach(self.created, function(value, key) {

                    self.created[key].startDate = new Date(value.startDate);

                    if(self.created[key].startDate - Date.now() > 0){
                        console.log(self.created[key].company.name);
                        self.main.push(self.created[key]);
                    } else {
                        self.side.push(self.created[key]);
                    }
                });
            });
        }
    };

    let calculateAge = function() {
        let ageDifMs = Date.now() - new Date(self.profile.dob);
        let ageDate = new Date(ageDifMs);
        self.age = Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    self.acceptJob = function (job) {
        console.log(job);
        jobService.acceptJob(job).then(function successCallback(response){
            if(response.status == 200){
                let myEl = angular.element( document.querySelector( '#card-'+job.id ) );
                console.log(myEl);
                myEl.addClass('animated bounceOutRight');
                myEl.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                    function() {
                        updateData();
                    });
            } else {
                console.log(response.status);
            }
        });
    };

    self.declineJob = function (job) {
        jobService.declineJob(job).then(function (response) {
            if(response.status == 200){
                let myEl = angular.element( document.querySelector( '#card-'+job.id ) );
                console.log(myEl);
                myEl.addClass('animated bounceOutLeft');
                myEl.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                    function() {
                        updateData();
                    });
            } else {
                console.log(response.status);
            }
        });
    };

    self.editProfile = function () {
        $location.path('/account')
    }

});