angular.module('myApp').controller('view-job', function ($filter, $location, $routeParams, $rootScope, $cookies,
                                                         jobService, userService, chatService, baListService, filterFilter) {

    let self = this;
    let id = $routeParams.id;

    let user = {};

    let userId = $cookies.get('currentUser');
    if(userId != null) {
        userService.findOne(userId).then(function successCallback(response) {
            $rootScope.currentUser = response.data;
            user = $rootScope.currentUser;
            updateData();
        });
    }

    self.curInvited = false;
    self.curAccepted = false;
    self.curDeclined = false;


    let updateData = function () {

        jobService.getJob(id).then(function (response) {
            self.job = response.data;
            self.dateMade = new Date(self.job.createdAt);
            self.job.startDate = new Date(self.job.startDate);
            self.job.endDate = new Date(self.job.endDate);

            if (!user.manager) {
                angular.forEach(self.job.invited, function (value) {
                    if (user.id == value.id) {
                        self.curInvited = true;
                    }
                });
                if (!self.curInvited) {
                    angular.forEach(self.job.accepted, function (value) {
                        if (user.id == value.id) {
                            self.curAccepted = true;
                        }
                    });
                    if (!self.curAccepted) {
                        angular.forEach(self.job.declined, function (value) {
                            if (user.id == value.id) {
                                self.curDeclined = true;
                            }
                        });
                    }
                }
            }

            userService.findByManager(false).then(function successCallback(response){
                self.bas = response.data;

                angular.forEach(self.bas, function (value, key) {
                    self.bas[key].selected = false;
                });

                self.getOverlappingJobs();
            });

            baListService.find(userId).then(function (response) {
                self.baLists = response.data;
            });

            baListService.company(self.job.company).then(function (response) {
                if (response.data.length > 0) {
                    let companyList = response.data[0];

                    companyList.title = "Previously worked with " + companyList.title;
                    self.baLists.push(companyList);
                }
            });

            initialize();
        });
    };

    self.acceptJob = function () {
        jobService.acceptJob(self.job).then(function (response) {
            self.curInvited = false;
            self.curAccepted = true;
            updateData();
        });
    };

    self.declineJob = function () {
        jobService.declineJob(self.job).then(function (response) {
            self.curInvited = false;
            self.curDeclined = true;
            updateData();
        });
    };

    self.openChat = function () {
        let chat = {};
        chat.participants = self.job.accepted;
        chat.participants.push(self.job.jobManager);
        chat.job = {};
        chat.job.id = id;
        chatService.jobChat(chat).then(function successCallback(response) {
            $location.path('/chat/'+response.data.id);
        });
    };

    let directionsDisplay;
    let directionsService = new google.maps.DirectionsService();
    let map;

    function initialize() {
        directionsDisplay = new google.maps.DirectionsRenderer();
        let chicago = new google.maps.LatLng(53.3239919,-6.5258808);
        let mapOptions = {
            zoom:7,
            center: chicago
        };
        map = new google.maps.Map(document.getElementById('map'), mapOptions);
        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById('directionsPanel'));
        if (user.address == null) {
            self.location = 'Verve, Grand Canal Dock';
        } else {
            self.location = angular.copy(user.address);
        }

        self.calcRoute();
    }
    self.travelMode = "DRIVING";

    self.calcRoute = function () {
        let end = self.job.location;

        let dateTime;
        if (self.job.startDate < new Date()) {
            dateTime = new Date();
        } else {
            dateTime = self.job.startDate;
        }
        let request = {
            origin:self.location,
            destination:end,
            travelMode: self.travelMode,
            transitOptions: {
                arrivalTime: dateTime,
                modes: ['BUS','RAIL','TRAIN','TRAM'],
                routingPreference: 'FEWER_TRANSFERS'
            },
            drivingOptions: {
                departureTime: dateTime
            },
            unitSystem: google.maps.UnitSystem.METRIC
        };
        directionsService.route(request, function(response, status) {
            if (status == 'OK') {
                console.log(response);
                directionsDisplay.setDirections(response);
            }
        });
    };

    self.edit = function () {
        $location.path('/job/new/'+self.job.id);
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

    self.getOverlappingJobs = function () {

        self.baList = self.bas;

        let job = {};
        job.startDate = self.job.startDate;
        job.endDate = self.job.endDate;
        let overlappingJobs = [];
        let unavailableBAs = [];


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

    self.invite = function () {
        console.log("INvirtngsd");
        self.job.invited = arrayUnique(self.job.invited.concat(filterFilter(self.bas, {selected: true})));

        jobService.createJob(self.job).then(function (response) {
            self.job = response.data;
        })
    };

    function arrayUnique(array) {
        let a = array.concat();
        for(let i=0; i<a.length; ++i) {
            for(let j=i+1; j<a.length; ++j) {
                if(a[i].id === a[j].id)
                    a.splice(j--, 1);
            }
        }

        return a;
    }
});