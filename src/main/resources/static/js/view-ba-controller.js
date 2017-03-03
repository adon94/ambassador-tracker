angular.module('myApp').controller('view-ba', function ($http, $timeout, $scope, $filter, $location, $routeParams, $rootScope, $cookies) {

    var self = this;
    var id = $routeParams.id;

    $rootScope.authenticated = $cookies.get('authenticated');
    $rootScope.empUser = ($cookies.get('empUser') === 'true');
    $rootScope.currentUser = JSON.parse($cookies.get('currentUser'));

    $http.get('/ba/view/'+id).then(function (response) {
        self.ba = response.data;
        self.ba.dob = new Date(self.ba.dob);
        self.age = calculateAge(self.ba.dob);
    });

    var calculateAge = function(birthday) { // birthday is a date
        var ageDifMs = Date.now() - new Date(birthday);
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    $http.get('/job/invited/'+id).then(function (response) {
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

    $http.get('/job/accepted/'+id).then(function (response) {
        self.accepted = response.data;

        angular.forEach(self.accepted, function(value, key) {

            self.accepted[key].startDate = new Date(value.startDate);

            if(self.accepted[key].startDate - Date.now() > 0){
                console.log(self.accepted[key].client);
                self.upcoming.push(self.accepted[key]);
            }

        });
    });

    $http.get('/job/declined/'+id).then(function (response) {

        self.declined = response.data;

        angular.forEach(self.declined, function(value, key) {

            self.declined[key].startDate = new Date(value.startDate)
        });
    });

    self.acceptJob = function (job) {
        console.log(job);
        let myEl = angular.element( document.querySelector( '#card-'+job.id ) );
        console.log(myEl);
        myEl.addClass('animated bounceOutRight');
        myEl.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
            function() {
                myEl.remove();
        });
        // $('#yourElement').addClass('animated bounceOutLeft');
        // jobService.acceptJob(job).then(function (response) {
        //     if(response.status == 200){
        //         console.log("Success");
        //     } else {
        //         console.log(response.status);
        //     }
        // });
    };

    self.declineJob = function (job) {
        console.log(job);
        let myEl = angular.element( document.querySelector( '#card-'+job.id ) );
        console.log(myEl);
        myEl.addClass('animated bounceOutLeft');
        myEl.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
            function() {
                myEl.remove();
            });
        // jobService.declineJob(job).then(function (response) {
        //     if(response.status == 200){
        //         console.log("Success");
        //     } else {
        //         console.log(response.status);
        //     }
        // });
    }
});