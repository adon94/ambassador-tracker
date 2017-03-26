angular.module('myApp').factory('userService', function($http) {

    return {
        findByManager: function (manager) {
            return $http.get('/user/manager/'+manager);
        },
        findOne: function (id) {
            return $http.get('/user/view/' + id);
        },
        create: function (user) {
            return $http.post('/user/create', user);
        },
        login: function (user) {
            return $http.post('/user/login', user);
        }
    }

});