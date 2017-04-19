angular.module('myApp').factory('baListService', function($http) {

    return {
        create: function (baList) {
            return $http.post('/baList/create', baList);
        },
        find: function (id) {
            return $http.get('/baList/' + id);
        },
        company: function (company) {
            return $http.post('/baList/company', company);
        }
    }
});