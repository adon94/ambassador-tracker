angular.module('myApp').controller('wages', function($scope, $rootScope, $cookies, jobService, $filter) {
    $scope.accepted = [];
    // let invited = [];
    $rootScope.authenticated = ($cookies.get("authenticated") === 'true');
    $rootScope.empUser = ($cookies.get('empUser') === 'true');
    let id;

    $scope.thisMonth = [];
    $scope.thisMonthPotential = [];
    let today = new Date();
    $scope.date = $filter('date')(today,'MMMM-yyyy');

    $scope.getJobsFromMonth = function (jobList, date) {
        let selectedMonth = [];

        angular.forEach(jobList, function (value, key) {

            jobList[key].startDate = new Date(value.startDate);
            jobList[key].endDate = new Date(value.endDate);

            // console.log("for each");

            if (jobList[key].startDate.getMonth() == date.getMonth()) {
                selectedMonth.push(jobList[key]);
            }
        });
        return selectedMonth;
    };


    $scope.getMonthWages = function (jobList) {

        $scope.monthWages = 0;

        angular.forEach(jobList, function (value, key) {

            console.log(jobList);

            jobList[key].eventHours = value.endDate.getHours() - value.startDate.getHours();

            console.log(jobList[key].company.name + "'s hours are " + jobList[key].eventHours);

            jobList[key].eventWages = jobList[key].wage * jobList[key].eventHours;

            $scope.monthWages += value.eventWages;

            console.log("Wages are "+value.eventWages);
        });

        return jobList;
    };

    $scope.onDateChange = function () {
        console.log("Changed Date........");

        $scope.thisMonth = $scope.getJobsFromMonth($scope.accepted, new Date($scope.date));

        $scope.thisMonth = $scope.getMonthWages($scope.thisMonth);
    };

    if($rootScope.authenticated && !$rootScope.empUser) {
        $rootScope.currentUser = JSON.parse($cookies.get('currentUser'));

        id = $rootScope.currentUser.id;

        // console.log("Wages ctrl");

        jobService.getAcceptedJobs(id).then(function (response) {
            $scope.accepted = response.data;
            // $scope.accepted = accepted;

            $scope.thisMonth = $scope.getJobsFromMonth($scope.accepted, new Date());

            $scope.thisMonth = $scope.getMonthWages($scope.thisMonth);

            console.log("Total wages: " + $scope.monthWages);
        });



        // jobService.getInvitedJobs(id).then(function (response) {
        //     invited = response.data;
        //     // $scope.invited = invited;
        //
        //     angular.forEach(invited, function (value, key) {
        //
        //         invited[key].startDate = new Date(value.startDate);
        //         invited[key].endDate = new Date(value.endDate);
        //
        //         // console.log("for each");
        //
        //         if (value.startDate.getMonth() == today.getMonth() && value.startDate > today) {
        //             $scope.thisMonthPotential.push(invited[key]);
        //
        //             // console.log("this month");
        //         }
        //     });
        //
        //     $scope.potentialMonthWages = 0;
        //
        //     angular.forEach($scope.thisMonthPotential, function (value, key) {
        //
        //         console.log($scope.thisMonthPotential);
        //
        //         value.eventHours = value.endDate.getHours() - value.startDate.getHours();
        //
        //         console.log($scope.thisMonthPotential[key].company.name + "'s hours are " + value.eventHours);
        //
        //         value.eventWages = value.wage * value.eventHours;
        //
        //         $scope.potentialMonthWages += value.eventWages;
        //
        //         console.log("Wages are "+value.eventWages);
        //     });
        //
        //     $scope.potentialMonthWages += $scope.monthWages;
        //
        //     console.log("Potential wages: " + $scope.potentialMonthWages);
        // });
    }
});