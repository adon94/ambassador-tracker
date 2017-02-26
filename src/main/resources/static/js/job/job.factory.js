angular.module('myApp').factory('jobService', function($http, $rootScope){

    return {
        getAllJobs : function() {
            console.log("getting jobs.....");
            return $http.get('/job/all');
        },

        getJob : function(id) {
            console.log("getting jobs.....");
            return $http.get('/job/view/'+id);
        },

        getCompanies : function () {
            return $http.get('/company/all');
        },

        createJob : function (job) {
            return $http.post("/job/create", job);
        },

        acceptJob : function (job) {
            return $http.post("/job/accept/"+$rootScope.currentUser.id, job);
        },

        declineJob : function (job) {
            return $http.post("/job/decline/"+$rootScope.currentUser.id, job);
        },

        deleteJob : function (id) {
            return $http.get('/job/remove/'+id);
        },

        getInvitedJobs : function (id) {
            return $http.get('/job/invited/'+id);
        },

        getAcceptedJobs : function (id) {
            return $http.get('/job/accepted/'+id);
        },

        getDeclinedJobs : function (id) {
            return $http.get('/job/declined/'+id);
        }
    }

});