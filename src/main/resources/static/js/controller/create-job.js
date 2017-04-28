angular.module('myApp').controller('createJob', function ($scope, $filter, filterFilter, $location, $rootScope,
                                                          $cookies, userService, jobService, baListService, $routeParams) {
    let self = this;
    $scope.gPlace;
    $scope.upload = true;
    let user = {};

    let id = $routeParams.id;

    let userId = $cookies.get('currentUser');

    if(userId != null) {
        userService.findOne(userId).then(function successCallback(response) {
            $rootScope.currentUser = response.data;
            user = $rootScope.currentUser;
        });
    }

    self.selected = [];
    self.startMoment ={};
    self.endMoment ={};

    if (id == null) {
        self.job = {};
        self.job.company = {};
        self.edit = false;
    } else {
        jobService.getJob(id).then(function (response) {
            self.job = response.data;
            self.edit = true;
        })
    }
    self.baLists = [];

    self.createJob = function () {
        let job = self.job;
        if(self.startMoment._d != null && self.endMoment._d != null) {
            job.startDate = self.startMoment._d;
            job.endDate = self.endMoment._d;
        }

        job.jobManager = {
            "id": $rootScope.currentUser.id,
            "firstName": $rootScope.currentUser.firstName,
            "lastName": $rootScope.currentUser.lastName
        };

        if (!self.edit) {
            job.invited = filterFilter(self.bas, {selected: true});
        }

        console.log(job);
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
        self.clients = $filter('orderBy')(response.data, '-client', false);
    });

    baListService.find(userId).then(function (response) {
        self.baLists = response.data;
    });

    self.getCompanyList = function () {
        baListService.company(self.job.company).then(function (response) {

            if (response.data.length > 0) {
                let companyList = response.data[0];

                companyList.title = "Previously worked with " + companyList.title;
                self.baLists.push(companyList);
            }
        })
    };

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

            angular.forEach(overlappingJobs, function (value, key) {
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
                self.baList[key].name = value.firstName + " " + value.lastName;
                angular.forEach(unavailableBAs, function (value2, key2){
                    if (value2.id == value.id){
                        self.baList[key].available = false;
                        self.baList[key].workingFor = value2.workingFor;
                    }
                });
            });
        });
    };

    self.onCompanyChange = function (str) {
        self.job.company.name = str;
    };

    self.onCompanySelect = function (selected) {
        if (selected != null) {
            self.job.company = selected.originalObject;
            console.log(selected);
            self.getCompanyList();
        }
    };

    self.listChange = function () {
        console.log("List change");
        console.log(self.selectedList);
    };

    self.myFilter = function(e) {
        if (self.selectedList != null) {
            return hasObject(e.id);
        } else {
            return true;
        }
    };

    let hasObject = function (id) {
        let retVal = false;
        angular.forEach(self.selectedList.ambassadors, function (value) {
            if (value.id == id) {
                retVal = true;
            }
        });
        return retVal;
    };

    $scope.fileSelected = function (element) {

        let file = element.files[0];
        let storageRef = firebase.storage().ref('events/' + file.name.replace(" ", ""));
        let state = storageRef.put(file);
        state.on('state_changed',
            function progress(snapshot) {
            },

            function error(err) {
            },

            function complete() {
                self.job.company.imageUrl = state.snapshot.downloadURL.toString();
            }
        );
    };
});