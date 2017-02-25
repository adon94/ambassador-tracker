angular.module('myApp').factory('jobService', function($http){

    return {
        getAllBas : function() {
            console.log("getting brand ambassadors.....");
            return $http.get('/ba/all');
        }


    }

});