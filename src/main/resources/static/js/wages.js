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
        $scope.selectedMonthWages = $scope.monthWages;
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

            Chart.defaults.global = {
                // Boolean - Whether to animate the chart
                animation: true,

                // Number - Number of animation steps
                animationSteps: 60,

                // String - Animation easing effect
                // Possible effects are:
                // [easeInOutQuart, linear, easeOutBounce, easeInBack, easeInOutQuad,
                //  easeOutQuart, easeOutQuad, easeInOutBounce, easeOutSine, easeInOutCubic,
                //  easeInExpo, easeInOutBack, easeInCirc, easeInOutElastic, easeOutBack,
                //  easeInQuad, easeInOutExpo, easeInQuart, easeOutQuint, easeInOutCirc,
                //  easeInSine, easeOutExpo, easeOutCirc, easeOutCubic, easeInQuint,
                //  easeInElastic, easeInOutSine, easeInOutQuint, easeInBounce,
                //  easeOutElastic, easeInCubic]
                animationEasing: "easeOutQuart",

                // Boolean - If we should show the scale at all
                showScale: true,

                // Boolean - If we want to override with a hard coded scale
                scaleOverride: false,

                // ** Required if scaleOverride is true **
                // Number - The number of steps in a hard coded scale
                scaleSteps: null,
                // Number - The value jump in the hard coded scale
                scaleStepWidth: null,
                // Number - The scale starting value
                scaleStartValue: null,

                // String - Colour of the scale line
                scaleLineColor: "rgba(0,0,0,.1)",

                // Number - Pixel width of the scale line
                scaleLineWidth: 1,

                // Boolean - Whether to show labels on the scale
                scaleShowLabels: true,

                // Interpolated JS string - can access value
                scaleLabel: "€<%=value%>",

                // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
                scaleIntegersOnly: true,

                // Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
                scaleBeginAtZero: false,

                // String - Scale label font declaration for the scale label
                scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

                // Number - Scale label font size in pixels
                scaleFontSize: 12,

                // String - Scale label font weight style
                scaleFontStyle: "normal",

                // String - Scale label font colour
                scaleFontColor: "#666",

                // Boolean - whether or not the chart should be responsive and resize when the browser does.
                responsive: false,

                // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
                maintainAspectRatio: true,

                // Boolean - Determines whether to draw tooltips on the canvas or not
                showTooltips: true,

                // Function - Determines whether to execute the customTooltips function instead of drawing the built in tooltips (See [Advanced - External Tooltips](#advanced-usage-custom-tooltips))
                customTooltips: false,

                // Array - Array of string names to attach tooltip events
                tooltipEvents: ["mousemove", "touchstart", "touchmove"],

                // String - Tooltip background colour
                tooltipFillColor: "rgba(0,0,0,0.8)",

                // String - Tooltip label font declaration for the scale label
                tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

                // Number - Tooltip label font size in pixels
                tooltipFontSize: 14,

                // String - Tooltip font weight style
                tooltipFontStyle: "normal",

                // String - Tooltip label font colour
                tooltipFontColor: "#fff",

                // String - Tooltip title font declaration for the scale label
                tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

                // Number - Tooltip title font size in pixels
                tooltipTitleFontSize: 14,

                // String - Tooltip title font weight style
                tooltipTitleFontStyle: "bold",

                // String - Tooltip title font colour
                tooltipTitleFontColor: "#fff",

                // Number - pixel width of padding around tooltip text
                tooltipYPadding: 6,

                // Number - pixel width of padding around tooltip text
                tooltipXPadding: 6,

                // Number - Size of the caret on the tooltip
                tooltipCaretSize: 8,

                // Number - Pixel radius of the tooltip border
                tooltipCornerRadius: 6,

                // Number - Pixel offset from point x to tooltip edge
                tooltipXOffset: 10,

                // String - Template string for single tooltips
                tooltipTemplate: "<%if (label){%><%=label%>: €<%}%><%= value %>",

                // String - Template string for multiple tooltips
                multiTooltipTemplate: "<%= value %>",

                // Function - Will fire on animation progression.
                onAnimationProgress: function(){},

                // Function - Will fire on animation completion.
                onAnimationComplete: function(){}
            };

            let wagesByMonth = [];

            let f;

            for(f = 0; f < 12; f++) {

                let d = new Date();
                d.setMonth(f);

                let thisMonthJobs = $scope.getJobsFromMonth($scope.accepted, d);

                $scope.getMonthWages(thisMonthJobs);

                wagesByMonth.push($scope.monthWages);
            }

            let data = {
                labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                datasets: [
                    {
                        label: "My First dataset",
                        fillColor: "rgba(151,187,205,0.2)",
                        strokeColor: "rgba(151,187,205,1)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",
                        data: wagesByMonth
                    }
                ]
            };

            let option = {
                responsive: true,
            };

            let ctx = angular.element( document.querySelector( '#myChart' ) )[0].getContext('2d');
            new Chart(ctx).Line(data, option); //'Line' defines type of the chart.
        });
    }
});