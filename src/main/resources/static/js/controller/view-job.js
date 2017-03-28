angular.module('myApp').controller('view-job', function ($filter, $location, $routeParams, $rootScope, $cookies, jobService, userService, chatService) {

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

    self.curInvited = false;
    self.curAccepted = false;
    self.curDeclined = false;

    jobService.getJob(id).then(function (response) {
        self.job = response.data;
        console.log(self.job);
        self.dateMade = new Date(self.job.createdAt);
        self.job.startDate = new Date(self.job.startDate);
        self.job.endDate = new Date(self.job.endDate);

        if(!user.manager){
            angular.forEach(self.job.invited, function(value) {
                if(user.id == value.id) {
                    self.curInvited = true;
                }
            });
            if(!self.curInvited){
                angular.forEach(self.job.accepted, function(value) {
                    if(user.id == value.id) {
                        self.curAccepted = true;
                    }
                });
                if (!self.curAccepted){
                    angular.forEach(self.job.declined, function(value) {
                        if(user.id == value.id) {
                            self.curDeclined = true;
                        }
                    });
                }
            }
        }

        self.acceptJob = function () {
            jobService.acceptJob(self.job).then(function (response) {
                if(response.status == 200){
                    console.log("Success");
                } else {
                    console.log(response.status);
                }
            });
        };

        self.declineJob = function () {
            jobService.declineJob(self.job).then(function (response) {
                if(response.status == 200){
                    console.log("Success");
                } else {
                    console.log(response.status);
                }
            });
        }
    });

    self.openChat = function () {
        let chat = {};
        chat.participants = self.job.accepted;
        chat.job = {};
        chat.job.id = id;
        chatService.jobChat(chat).then(function successCallback(response) {
            $location.path('/chat/'+response.data.id);
        });
    };
});