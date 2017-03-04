angular.module('myApp').controller('home', function($scope, $http, $rootScope, $location, $cookies, $compile, uiCalendarConfig) {
    var self = this;
    $rootScope.authenticated = $cookies.get('authenticated');

    var id;

    if ($rootScope.authenticated) {

        $rootScope.empUser = ($cookies.get('empUser') === 'true');

        $rootScope.currentUser = JSON.parse($cookies.get('currentUser'));
        id = $rootScope.currentUser.id;

        console.log(($cookies.get('empUser') === 'true'));
        $http.get('/employee/all').then(function (response) {
            self.employees = response.data;
        });
        $http.get('/ba/all').then(function (response) {
            self.bas = response.data;
        });
        $http.get('/job/all').then(function (response) {
            self.jobs = response.data;
        });
    }

    $scope.deleteJob = function (id) {
        $http.get('/job/remove/'+id).then(function(response) {
            console.log(response.data);
            self.jobs.splice("job-row"+id,1);
        })
    };

    $scope.deleteEmp = function (id) {
        $http.get('/employee/remove/'+id).then(function(response) {
            console.log(response.data);
            self.employees.splice("emp-row"+id,1);
        })
    };

    $scope.deleteBa = function (id) {
        $http.get('/ba/remove/'+id).then(function(response) {
            console.log(response.data);
            self.bas.splice("ba-row"+id,1);
        })
    };


    //Calendar stuff
    $scope.viewJob = function (id) {
        $location.path("/job/view/" + id);
    };

    $scope.viewBa = function (id) {
        $location.path("/ba/view/" + id);
    };

    let today = new Date();
    let invited = [];
    $scope.invitedEvents = [];
    let accepted= [];
    $scope.acceptedEvents= [];
    $scope.pastAcceptedEvents= [];

    if (!$rootScope.empUser && $rootScope.authenticated) {
        $http.get('/job/invited/' + id).then(function (response) {
            invited = response.data;
            $scope.invited = invited;
            // for (inv in self.invited){
            //     inv.startDate = new Date(inv.startDate);
            // }
            angular.forEach(invited, function (value, key) {
                // console.log(key + ': ' + );
                invited[key].startDate = new Date(value.startDate);

                if(invited[key].startDate > today) {
                    $scope.invitedEvents.push({
                        title: invited[key].company.name,
                        start: invited[key].startDate,
                        className: 'invitedEvent',
                        url: '/#/job/view/' + invited[key].id
                        // backgroundColor: "#ff374b",
                        // stick: true
                    })
                }
            });
        });

        $http.get('/job/accepted/' + id).then(function (response) {
            accepted = response.data;
            $scope.accepted = accepted;

            angular.forEach(accepted, function (value, key) {

                accepted[key].startDate = new Date(value.startDate);

                if(accepted[key].startDate > today) {
                    $scope.acceptedEvents.push({
                        title: accepted[key].company.name,
                        start: accepted[key].startDate,
                        className: 'acceptedEvent',
                        url: '/#/job/view/' + accepted[key].id
                    })
                } else {
                    $scope.pastAcceptedEvents.push({
                        title: accepted[key].company.name,
                        start: accepted[key].startDate,
                        className: 'pastAcceptedEvent',
                        url: '/#/job/view/' + accepted[key].id
                    })
                }
            });
        });
    } else if ($rootScope.empUser && $rootScope.authenticated) {
        //get employee's events
    }

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $scope.changeTo = 'Hungarian';
    /* event source that pulls from google.com */
    // $scope.eventSource = {
    //     url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
    //     className: 'gcal-event',           // an option!
    //     currentTimezone: 'America/Chicago' // an option!
    // };
    /* event source that contains custom events on the scope */
    // if(invited != null) {
    //     $scope.events = [
    //         {title: invited[2].company.name, start: invited[2].startDate}
    //         // {title: 'All Day Event',start: new Date(y, m, 1)},
    //         // {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
    //         // {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
    //         // {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
    //         // {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
    //         // {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    //     ];
    // } else {
        $scope.events = [
            {title: 'All Day Event',start: new Date(y, m, 1)},
            {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
            {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
            {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
            {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
            {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
        ];

    $scope.invEvents = {
        events: $scope.invitedEvents
    };

    $scope.accEvents = {
        events: $scope.acceptedEvents
    };

    $scope.pastAccEvents = {
        events: $scope.pastAcceptedEvents
    };
    // }
    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, timezone, callback) {
        var s = new Date(start).getTime() / 1000;
        var e = new Date(end).getTime() / 1000;
        var m = new Date(start).getMonth();
        var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
        callback(events);
    };

    /* alert on eventClick */
    $scope.alertOnEventClick = function( date, jsEvent, view){
        $scope.alertMessage = (date.title + ' was clicked ');
    };
    /* alert on Drop */
    $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
        $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
        $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
        var canAdd = 0;
        angular.forEach(sources,function(value, key){
            if(sources[key] === source){
                sources.splice(key,1);
                canAdd = 1;
            }
        });
        if(canAdd === 0){
            sources.push(source);
        }
    };
    /* add custom event*/
    $scope.addEvent = function() {
        $scope.events.push({
            title: 'Open Sesame',
            start: new Date(y, m, 28),
            end: new Date(y, m, 29),
            className: ['openSesame']
        });
    };
    /* remove event */
    $scope.remove = function(index) {
        $scope.events.splice(index,1);
    };
    /* Change View */
    $scope.changeView = function(view,calendar) {
        uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalender = function(calendar) {
        if(uiCalendarConfig.calendars[calendar]){
            uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
    };
    /* Render Tooltip */
    $scope.eventRender = function( event, element, view ) {
        element.attr({'tooltip': event.title,
            'tooltip-append-to-body': true});
        $compile(element)($scope);
    };
    /* config object */
    $scope.uiConfig = {
        calendar:{
            height: 550,
            editable: false,
            header:{
                left: 'title',
                center: '',
                right: 'today prev,next'
            },
            eventClick: $scope.alertOnEventClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize,
            eventRender: $scope.eventRender
        }
    };

    $scope.changeLang = function() {
        if($scope.changeTo === 'Hungarian'){
            $scope.uiConfig.calendar.dayNames = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
            $scope.uiConfig.calendar.dayNamesShort = ["Vas", "Hét", "Kedd", "Sze", "Csüt", "Pén", "Szo"];
            $scope.changeTo= 'English';
        } else {
            $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            $scope.changeTo = 'Hungarian';
        }
    };
    /* event sources array*/
    $scope.eventSources = [$scope.invEvents, $scope.accEvents, $scope.pastAccEvents];
});