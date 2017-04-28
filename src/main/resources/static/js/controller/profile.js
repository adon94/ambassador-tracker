angular.module('myApp').controller('profile', function ($rootScope, $cookies, $timeout, $filter, $location,
                                                        $routeParams, jobService, userService, chatService,
                                                        baListService, $scope) {

    let self = this;
    let id = $routeParams.id;
    let user = {};
    self.baLists = [];
    $scope.upload = true;
    $scope.cupload = true;

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

            self.main = [];

            jobService.getInvitedJobs(id).then(function (response) {
                self.pending = response.data;

                angular.forEach(self.pending, function (value, key) {
                    self.pending[key].startDate = new Date(value.startDate);
                    if (self.pending[key].startDate - Date.now() > 0) {
                        self.main.push(self.pending[key]);
                    }
                });
            });

            self.side = [];

            jobService.getAcceptedJobs(id).then(function (response) {
                self.accepted = response.data;

                angular.forEach(self.accepted, function (value, key) {

                    self.accepted[key].startDate = new Date(value.startDate);

                    if (self.accepted[key].startDate - Date.now() > 0) {
                        self.side.push(self.accepted[key]);
                    }

                });
            });
            console.log(user.manager);
            if (user.manager) {
                baListService.find(user.id).then(function (response) {
                    self.baLists = response.data;
                    console.log("Lists:", self.baLists);
                })
            }

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
    };

    self.openChat = function () {
        let chat = {};
        chat.participants = [];
        chat.participants.push(user);
        chat.participants.push(self.profile);
        chatService.userChat(chat).then(function successCallback(response) {
            $location.path('/chat/'+response.data.id);
        })
    };

    self.createList = function () {
        self.baList.ambassadors = [self.profile];
        self.baList.listManager = user;

        baListService.create(self.baList).then(function (response) {
            self.baLists.push(response.data);
            self.baList = {};
        })
    };

    self.addToList = function (list) {
        list.ambassadors.push(self.profile);
        baListService.create(list).then(function (response) {
            self.baLists.push(response.data);
            self.baList = {};
        })
    };

    self.updateProfile = function () {
        $rootScope.currentUser.imageUrl = self.profile.imageUrl;
        $rootScope.currentUser.coverUrl = self.profile.coverUrl;

        userService.create($rootScope.currentUser).then(function (response) {
            $rootScope.currentUser = response.data;
        })
    };

    $scope.fileSelected = function (element) {

        let file = element.files[0];
        let storageRef = firebase.storage().ref('users/'+ $rootScope.currentUser.id +"/"+ file.name.replace(" ", ""));
        let state = storageRef.put(file);
        state.on('state_changed',
            function progress(snapshot) {
            },

            function error(err) {
            },

            function complete() {
                if(self.main) {
                    self.profile.imageUrl = state.snapshot.downloadURL.toString();
                    console.log(self.profile.imageUrl, ': is my new profiler');
                } else {
                    self.profile.coverUrl = state.snapshot.downloadURL;
                    console.log(self.profile.coverUrl, ': is my new cover');
                }
            }
        );
    };

});