angular.module('myApp').controller('view-ba', function ($http, jobService, $timeout, $scope, $filter, $location, $routeParams, $rootScope, $cookies) {

    let self = this;
    let id = $routeParams.id;

    $rootScope.authenticated = $cookies.get('authenticated');
    $rootScope.empUser = ($cookies.get('empUser') === 'true');
    $rootScope.currentUser = JSON.parse($cookies.get('currentUser'));

    $http.get('/ba/view/'+id).then(function (response) {
        self.ba = response.data;
        self.ba.dob = new Date(self.ba.dob);
        self.age = calculateAge(self.ba.dob);
    });

    let calculateAge = function(birthday) { // birthday is a date
        let ageDifMs = Date.now() - new Date(birthday);
        let ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    self.upcoming = [];

    $scope.refresh = function() {

        jobService.getInvitedJobs(id).then(function (response) {
            self.invited = response.data;
            // for (inv in self.invited){
            //     inv.startDate = new Date(inv.startDate);
            // }
            angular.forEach(self.invited, function(value, key) {
                // console.log(key + ': ' + );
                self.invited[key].startDate = new Date(value.startDate)
            });
        });

        self.upcoming = [];

        jobService.getAcceptedJobs(id).then(function (response) {
            self.accepted = response.data;

            angular.forEach(self.accepted, function(value, key) {

                self.accepted[key].startDate = new Date(value.startDate);

                if(self.accepted[key].startDate - Date.now() > 0){
                    console.log(self.accepted[key].client);
                    self.upcoming.push(self.accepted[key]);
                }

            });
        });

        jobService.getDeclinedJobs(id).then(function (response) {

            self.declined = response.data;

            angular.forEach(self.declined, function(value, key) {

                self.declined[key].startDate = new Date(value.startDate)
            });
        });
    };

    $scope.refresh();

    self.acceptJob = function (job) {
        console.log(job);
        jobService.acceptJob(job).then(function successCallback(response){
            if(response.status == 200){
                let myEl = angular.element( document.querySelector( '#card-'+job.id ) );
                console.log(myEl);
                myEl.addClass('animated bounceOutRight');
                myEl.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                    function() {
                        // myEl.remove();
                        $scope.refresh();
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
                        $scope.refresh();
                    });
            } else {
                console.log(response.status);
            }
        });
    };

    if($rootScope.empUser) {
        $http.get("/baList/" + id).then(function (response) {
            self.baLists = response.data;
        });
    }
});