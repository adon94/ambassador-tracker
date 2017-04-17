angular.module('myApp').factory('notificationService', function($http) {

    return {
        findByUser: function (user, type) {
            return $http.post('/notification/user/'+type, user);
        },
        save: function (notifications) {
            return $http.post('/notification/save', notifications);
        }
    }

});