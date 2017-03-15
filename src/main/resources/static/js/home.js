angular.module('myApp').controller('home', function($scope, $http, $rootScope, jobService, $location, $cookies, $compile, uiCalendarConfig) {
    let self = this;
    $rootScope.authenticated = $cookies.get('authenticated');

    let id;

    let CLIENT_ID = '1009962031783-q0gk1vg0u75t51m5iphhqi4a15883t39.apps.googleusercontent.com';
    let DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
    let SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
    $scope.gEvents = [];

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

    function initClient() {
        gapi.client.init({
            discoveryDocs: DISCOVERY_DOCS,
            clientId: CLIENT_ID,
            scope: SCOPES
        }).then(function () {
            // Listen for sign-in state changes.
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
            // $cookies.put('gapi', JSON.stringify(gapi));

            // Handle the initial sign-in state.
            updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        });
    }

    function updateSigninStatus(isSignedIn) {
        console.log("updateSigninStatus");
        if (isSignedIn) {
            console.log("SIGNED IN");
            gapi.client.calendar.events.list({
                'calendarId': 'primary',
                'timeMin': (new Date()).toISOString(),
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 10,
                'orderBy': 'startTime'
            }).then(function (response) {
                let events = response.result.items;
                $scope.gEvents = [];

                if (events.length > 0) {
                    for (i = 0; i < events.length; i++) {
                        let event = events[i];
                        let when = event.start.dateTime;
                        if (!when) {
                            when = event.start.date;
                        }
                        // appendPre(event.summary + ' (' + when + ')');

                        let eventItem = {
                            title: event.summary,
                            start: when,
                            className: 'gCalEvent'
                        };
                        console.log(eventItem);
                        $scope.gEvents.push(eventItem);
                    }

                    $scope.googleEvents = {
                        events: $scope.gEvents
                    };

                    $scope.addRemoveEventSource($scope.eventSources, $scope.googleEvents);
                } else {
                    console.log('No upcoming events found.');
                }
            });
        } else {
            console.log("NOT SIGNED IN");
            //----------Sign in prompt------------
            // gapi.auth2.getAuthInstance().signIn();
        }
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

        $scope.invEvents = {
            events: $scope.invitedEvents
        };

        $scope.accEvents = {
            events: $scope.acceptedEvents
        };

        $scope.pastAccEvents = {
            events: $scope.pastAcceptedEvents
        };

        $scope.eventSources = [$scope.invEvents, $scope.accEvents, $scope.pastAccEvents];

    } else if ($rootScope.empUser && $rootScope.authenticated) {

        let past = [];
        let upcoming = [];

        jobService.getEmployeesJobs(id).then(function (response) {
            let created = response.data;

            angular.forEach(created, function(value, key) {

                created[key].startDate = new Date(value.startDate);

                let eventItem = {
                    title: created[key].company.name,
                    start: created[key].startDate,
                    className: 'pastAcceptedEvent',
                    url: '/#/job/view/' + created[key].id
                };

                if(created[key].startDate - Date.now() < 0){
                    past.push(eventItem);
                } else {
                    eventItem.className = 'acceptedEvent';
                    upcoming.push(eventItem);
                }
            });
        });

        $scope.pastEvents = {
            events: past
        };

        $scope.upcomingEvents = {
            events: upcoming
        };

        $scope.eventSources = [$scope.pastEvents, $scope.upcomingEvents];

        gapi.load('client:auth2', initClient);
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
            uiCalendarConfig.calendars.myCalendar.fullCalendar( 'addEventSource', source );
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
            timeFormat:'HH:mm',
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
    /* event sources array*/
});