angular.module('myApp').controller('home', function($http, $scope, $rootScope, jobService, $location, $cookies, userService, $compile, uiCalendarConfig) {

    let self = this;
    let user = {};

    let userId = $cookies.get('currentUser');
    if(userId != null) {
        userService.findOne(userId).then(function successCallback(response) {
            $rootScope.currentUser = response.data;
            user = $rootScope.currentUser;
            updateData();
        });
    }

    let CLIENT_ID = '1009962031783-q0gk1vg0u75t51m5iphhqi4a15883t39.apps.googleusercontent.com';
    let DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
    let SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
    self.gEvents = [];

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
                self.gEvents = [];

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
                        self.gEvents.push(eventItem);
                    }

                    self.googleEvents = {
                        events: self.gEvents
                    };

                    $scope.addRemoveEventSource(self.eventSources, self.googleEvents);
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

    let today = new Date();
    let invited = [];
    $scope.invitedEvents = [];
    let accepted= [];
    $scope.acceptedEvents= [];
    $scope.pastAcceptedEvents= [];

    let updateData = function () {

        if (!user.manager) {
            jobService.getInvitedJobs(user.id).then(function (response) {
                invited = response.data;
                $scope.invited = invited;
                // for (inv in $scope.invited){
                //     inv.startDate = new Date(inv.startDate);
                // }
                angular.forEach(invited, function (value, key) {
                    // console.log(key + ': ' + );
                    invited[key].startDate = new Date(value.startDate);

                    if (invited[key].startDate > today) {
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

            jobService.getAcceptedJobs(user.id).then(function (response) {
                accepted = response.data;
                $scope.accepted = accepted;

                angular.forEach(accepted, function (value, key) {

                    accepted[key].startDate = new Date(value.startDate);

                    if (accepted[key].startDate > today) {
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

        } else if (user.manager) {

            $scope.past = [];
            $scope.upcoming = [];

            jobService.getEmployeesJobs(user.id).then(function (response) {
                let created = response.data;
                console.log(created);

                angular.forEach(created, function (value, key) {

                    created[key].startDate = new Date(value.startDate);

                    let eventItem = {
                        title: created[key].company.name,
                        start: created[key].startDate,
                        className: 'pastAcceptedEvent',
                        url: '/#/job/view/' + created[key].id
                    };

                    if (created[key].startDate - Date.now() < 0) {
                        $scope.past.push(eventItem);
                    } else {
                        eventItem.className = 'acceptedEvent';
                        $scope.upcoming.push(eventItem);
                    }
                });
            });

            $scope.pastEvents = {
                events: $scope.past
            };

            $scope.upcomingEvents = {
                events: $scope.upcoming
            };

            self.eventSources = [$scope.pastEvents, $scope.upcomingEvents];

            gapi.load('client:auth2', initClient);
        }
    };

    const date = new Date();
    const d = date.getDate();
    const m = date.getMonth();
    const y = date.getFullYear();

    /* alert on eventClick */
    $scope.alertOnEventClick = function (date, jsEvent, view) {
        $scope.alertMessage = (date.title + ' was clicked ');
    };
    /* alert on Drop */
    $scope.alertOnDrop = function (event, delta, revertFunc, jsEvent, ui, view) {
        $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function (event, delta, revertFunc, jsEvent, ui, view) {
        $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };
    /* add and remove an event source of choice */
    $scope.addRemoveEventSource = function (sources, source) {
        let canAdd = 0;
        angular.forEach(sources, function (value, key) {
            if (sources[key] === source) {
                sources.splice(key, 1);
                canAdd = 1;
            }
        });
        if (canAdd === 0) {
            uiCalendarConfig.calendars.myCalendar.fullCalendar('addEventSource', source);
        }
    };
    /* add custom event*/
    $scope.addEvent = function () {
        $scope.events.push({
            title: 'Open Sesame',
            start: new Date(y, m, 28),
            end: new Date(y, m, 29),
            className: ['openSesame']
        });
    };
    /* remove event */
    $scope.remove = function (index) {
        $scope.events.splice(index, 1);
    };
    /* Change View */
    $scope.changeView = function (view, calendar) {
        uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
    };
    /* Change View */
    $scope.renderCalender = function (calendar) {
        if (uiCalendarConfig.calendars[calendar]) {
            uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
    };
    /* Render Tooltip */
    $scope.eventRender = function (event, element, view) {
        element.attr({
            'tooltip': event.title,
            'tooltip-append-to-body': true
        });
        $compile(element)($scope);
    };
    /* config object */
    self.uiConfig = {
        calendar: {
            timeFormat: 'HH:mm',
            height: 550,
            editable: false,
            header: {
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

});