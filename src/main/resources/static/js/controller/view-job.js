angular.module('myApp').controller('view-job', function ($filter, $location, $routeParams, $rootScope, $cookies, jobService, userService, chatService) {

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

            initialize();
        });
    };

    self.acceptJob = function () {
        jobService.acceptJob(self.job).then(function (response) {
            updateData();
        });
    };

    self.declineJob = function () {
        jobService.declineJob(self.job).then(function (response) {
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
    }


});