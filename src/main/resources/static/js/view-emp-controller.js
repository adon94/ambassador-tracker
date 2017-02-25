angular.module('myApp').controller('view-emp', function ($http, $scope, $filter, $location, $routeParams, $cookies, $rootScope) {

    var self = this;
    var id = $routeParams.id;

    $rootScope.authenticated = $cookies.get('authenticated');
    $rootScope.empUser = ($cookies.get('empUser') === 'true');
    $rootScope.currentUser = JSON.parse($cookies.get('currentUser'));

    $http.get('/employee/view/'+id).then(function (response) {
        self.emp = response.data;
    });

    self.upcoming = [];

    $http.get('/job/employee/'+id).then(function (response) {
        self.created = response.data;

        angular.forEach(self.created, function(value, key) {

            self.created[key].startDate = new Date(value.startDate);

            if(self.created[key].startDate - Date.now() > 0){
                console.log(self.created[key].company.name);
                self.upcoming.push(self.created[key]);
            }
        });
    });
});