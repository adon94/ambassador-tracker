angular.module('myApp').controller('view-emp', function ($http, jobService, $scope, $filter, $location, $routeParams, $cookies, $rootScope) {

    let self = this;
    let id = $routeParams.id;

    $rootScope.authenticated = $cookies.get('authenticated');
    $rootScope.empUser = ($cookies.get('empUser') === 'true');
    $rootScope.currentUser = JSON.parse($cookies.get('currentUser'));

    $http.get('/employee/view/'+id).then(function (response) {
        self.emp = response.data;
    });

    self.upcoming = [];
    self.past = [];

    jobService.getEmployeesJobs(id).then(function (response) {
        self.created = response.data;

        angular.forEach(self.created, function(value, key) {

            self.created[key].startDate = new Date(value.startDate);

            if(self.created[key].startDate - Date.now() > 0){
                console.log(self.created[key].company.name);
                self.upcoming.push(self.created[key]);
            } else {
                self.past.push(self.created[key]);
            }
        });
    });
});