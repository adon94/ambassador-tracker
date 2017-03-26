angular.module('myApp').controller('createJob', function ($scope, $filter, filterFilter, $location, $rootScope, $cookies, userService, jobService) {
    let self = this;
    $scope.gPlace;
    let user = {};

    let userId = $cookies.get('currentUser');

    if(userId != null) {
        userService.findOne(userId).then(function successCallback(response) {
            $rootScope.currentUser = response.data;
            user = $rootScope.currentUser;
        });
    }

    self.selected = [];
    self.job = {};

    self.createJob = function () {
        let job = self.job;
        if(self.startMoment != null && self.endMoment != null) {
            job.startDate = self.startMoment._d;
            job.endDate = self.endMoment._d;
        }

        job.jobManager = {
            "id": $rootScope.currentUser.id
        };

        job.invited = filterFilter(self.bas, { selected: true });
        if(Object.prototype.toString.call(self.companyItem) == '[object String]'){
            job.company = {};
            job.company.name = self.companyItem;
        } else {
            job.company = self.companyItem;
        }

        job.company.imageUrl = self.companyImageUrl;

        jobService.createJob(job).then(function (response) {
            if(response.status == 200){
                $location.path("/");
            }
        });
    };

    userService.findByManager(false).then(function successCallback(response){
        self.bas = response.data;

        angular.forEach(self.bas, function (value, key) {
            self.bas[key].selected = false;
        });
    });

    jobService.getCompanies().then(function (response) {
        self.clients = response.data;
        console.log(self.clients)
    });

    self.getOverlappingJobs = function () {

        self.baList = self.bas;

        let job = {};
        job.startDate = self.startMoment._d;
        job.endDate = self.endMoment._d;
        let overlappingJobs = [];
        let unavailableBAs = [];


        //Make sure this works
        jobService.getOverlappingJobs(job).then(function (response) {
            overlappingJobs = response.data;
            console.log(overlappingJobs);

            angular.forEach(overlappingJobs, function (value, key) {
                console.log(overlappingJobs[key].accepted);
                console.log("In first loop");
                angular.forEach(overlappingJobs[key].accepted, function (value2, key2) {
                    if (unavailableBAs.indexOf(value2) == -1){
                        value2.workingFor = value.company;
                        value2.jobId = value.id;
                        unavailableBAs.push(value2)
                    }
                });
            });

            angular.forEach(self.baList, function (value, key) {
                self.baList[key].available = true;
                self.baList[key].workingFor = null;
                self.baList[key].jobId = null;
                angular.forEach(unavailableBAs, function (value2, key2){
                    if (value2.id == value.id){
                        self.baList[key].available = false;
                        self.baList[key].workingFor = value2.workingFor;
                    }
                });
            });
        });
    }
});