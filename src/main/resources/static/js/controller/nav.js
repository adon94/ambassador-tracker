angular.module('myApp').controller('nav', function($rootScope, $cookies, $location, $interval, userService,
                                                   notificationService, $q, $filter) {

    let self = this;
    let user = {};
    let userId = $cookies.get('currentUser');
    if(userId != null) {
        userService.findOne(userId).then(function successCallback(response) {
            $rootScope.currentUser = response.data;
            user = $rootScope.currentUser;
            updateData();
        });
    }

    if (userId == null) {
        $location.path("/login");
    } else {
        userService.findOne(userId).then(function successCallback(response) {
            $rootScope.currentUser = response.data;
//                $rootScope.msgNotifications = [];
            updateData();
        });
        userService.all().then(function (response) {
            self.allUsers = response.data;
        })
    }

    $rootScope.onSearchSelect = function (selected) {
        $location.path('/profile'+selected.originalObject.id);
    };

    $interval(updateData, 5000);

    function updateData() {
        if ($rootScope.currentUser != null) {
            if ($rootScope.currentUser.id != null) {

                let promises = {
                    alpha: userService.updateLastSeen($rootScope.currentUser),
                    beta: notificationService.findByUser($rootScope.currentUser, 'message'),
                    gamma: notificationService.findByUser($rootScope.currentUser, 'general')
                };

                $q.all(promises).then(function(arrayOfResults) {
                    $rootScope.currentUser = arrayOfResults.alpha.data;
                    self.msgNotifications = UniqueArraybyId($filter('orderBy')(arrayOfResults.beta.data, 'timestamp', true),"chat");
                    self.genNotifications = arrayOfResults.gamma.data;
                    let unread = 0;
                    angular.forEach(self.msgNotifications, function (value) {
                        if (!value.seen) {
                            unread++;
                        }
                    });
                    self.msgCount = unread;

                    unread = 0;
                    angular.forEach(self.genNotifications, function (value) {
                        if (!value.seen) {
                            unread++;
                        }
                    });
                    self.ntfCount = unread;

                });
            }
        } else if (userId != null) {
            userService.findOne(userId).then(function successCallback(response) {
                $rootScope.currentUser = response.data;
            });
        }
    }

    function UniqueArraybyId(collection, keyname) {
        let output = [],
            keys = [];

        angular.forEach(collection, function(value) {
            let key = value[keyname].id;
            if(keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(value);
            }
        });
        return output;
    }

    self.openMessage = function (msgNotification) {
        if (msgNotification.seen == false) {
            msgNotification.seen = true;
            let nList = [];
            nList.push(msgNotification);
            console.log("Message seen");
            notificationService.save(nList).then(function successCallback(response) {
                msgNotification = response.data;
            });
        }

        $location.path('/chat/' + msgNotification.chat.id);
    };

    self.openNotification = function (notification) {
        if (notification.seen == false) {
            notification.seen = true;
            let nList = [];
            nList.push(notification);
            notificationService.save(nList).then(function successCallback(response) {
                self.genNotifications = response.data;
            });
        }

        $location.path('/job/view/' + notification.job.id);
    };

    self.readNotifications = function () {
        console.log("Read notifications");
        angular.forEach(self.genNotifications, function (value, key) {
            self.genNotifications[key].seen = true;
        });
        notificationService.save(self.genNotifications).then(function (response) {
            self.genNotifications = response.data;
            self.ntfCount = 0;
        })
    };

    self.readMessages = function () {
        console.log("Read notifications");
        angular.forEach(self.msgNotifications, function (value, key) {
            self.msgNotifications[key].seen = true;
        });
        notificationService.save(self.msgNotifications).then(function (response) {
            self.msgNotifications = response.data;
            self.msgCount = 0;
        })
    };

    self.logout = function () {
        console.log("Logging out");
        $cookies.remove('currentUser');
        $rootScope.currentUser = null;
        $location.path("/login");
    };

});