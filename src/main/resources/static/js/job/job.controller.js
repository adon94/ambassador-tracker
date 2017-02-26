angular.module('myApp').controller('job', function ($scope, $filter, $location, $rootScope, $cookies, baService, jobService) {
    var self = this;
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
    // var employee = {
    //     "id": 1
    // };

    // var job = this.job;
    // this.job.employee = employee;
    // var job = self.job;
    self.job = {};

    self.createJob = function () {
        var job = self.job;
        job.startDate = myFormat($scope.dt1, $scope.startTime);
        job.endDate = myFormat($scope.dt2, $scope.endTime);
        job.employee = {
            "id": $rootScope.currentUser.id
        };
        job.invited = self.selected;
        if(Object.prototype.toString.call(self.companyItem) == '[object String]'){
            job.company = {};
            job.company.name = self.companyItem;
        } else {
            job.company = self.companyItem;
        }

        console.log(job);

        jobService.createJob(job).then(function (response) {
            console.log(response);
            if(response.status == 200){
                $location.path("/");
            }
        });
    };

    var myFormat = function (date, time) {
        var newDate = $filter('date')(date,'yyyy-MM-dd');
        var newTime = $filter('date')(time,'HH:mm:ss');
        return newDate + " " + newTime;
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
        console.log(self.bas);
    });

    jobService.getCompanies().then(function (response) {
        self.clients = response.data;
    });

    self.acceptJob = function (job) {
        console.log(job);
        jobService.acceptJob(job).then(function (response) {
            if(response.status == 200){
                console.log("Success");
            } else {
                console.log(response.status);
            }
        });
    };

    self.declineJob = function (job) {
        console.log(job);
        jobService.declineJob(job).then(function (response) {
            if(response.status == 200){
                console.log("Success");
            } else {
                console.log(response.status);
            }
        });
    }
});