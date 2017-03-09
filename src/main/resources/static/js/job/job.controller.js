angular.module('myApp').controller('job', function ($scope, $filter, filterFilter, $location, $rootScope, $cookies, baService, jobService) {
    let self = this;
    $scope.gPlace;

    $rootScope.authenticated = $cookies.get('authenticated');
    $rootScope.empUser = ($cookies.get('empUser') === 'true');
    $rootScope.currentUser = JSON.parse($cookies.get('currentUser'));

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.popup1 = {
        opened: false
    };
    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };

    $scope.popup2 = {
        opened: false
    };

    $scope.format = 'dd-MM-yyyy';

    $scope.hstep = 1;
    $scope.mstep = 1;

    $scope.hstep2 = 1;
    $scope.mstep2 = 1;

    self.selected = [];
    self.job = {};

    self.createJob = function () {
        let job = self.job;
        if(self.startMoment != undefined && self.endMoment != undefined) {
            job.startDate = self.startMoment._d;
            job.endDate = self.endMoment._d;
        }
        job.employee = {
            "id": $rootScope.currentUser.id
        };
        // job.invited = self.selected;
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

    // $(document).on('click', '.browse', function(){
    //     var file = $(this).parent().parent().parent().find('.file');
    //     file.trigger('click');
    // });
    // $(document).on('change', '.file', function(){
    //     $(this).parent().find('.form-control').val($(this).val().replace(/C:\\fakepath\\/i, ''));
    // });


    // $scope.variableName = [];



    baService.getAllBas().then(function successCallback(response){
        self.bas = response.data;

        angular.forEach(self.bas, function (value, key) {
            self.bas[key].selected = false;
        });
    });

    jobService.getCompanies().then(function (response) {
        self.clients = response.data;
    });

    self.getOverlappingJobs = function () {

        self.baList = self.bas;

        let job = {};
        job.startDate = self.startMoment._d;
        job.endDate = self.endMoment._d;
        let overlappingJobs = [];
        let unavailableBAs = [];

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

            // self.bas = self.bas.concat(unavailableBAs);
        });

        // angular.forEach(self.bas, function (value3, key3) {
        //     if (value3.id == value2.id){
        //         self.bas[key3].available = false;
        //         self.bas[key3].workingFor = value.employee;
        //         console.log("Unavailable")
        //     }
        // });
    }
});