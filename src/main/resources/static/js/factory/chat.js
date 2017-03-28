angular.module('myApp').factory('chatService', function($http) {

    return {
        findByParticipants: function (id) {
            return $http.get('/chat/'+id);
        },
        findOne: function (id) {
            return $http.get('/chat/get/'+id);
        },
        create: function (chat) {
            return $http.post('/chat/create', chat);
        },
        jobChat: function (chat) {
            return $http.post('/chat/job', chat);
        }
    }

});