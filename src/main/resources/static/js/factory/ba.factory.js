/**
 * Created by andy1997 on 25/02/2017.
 */
angular.module('myApp').factory('baService', function($http){

    return {
        getAllBas : function() {
            console.log("getting brand ambassadors.....");
            return $http.get('/ba/all');
        }


    }

});