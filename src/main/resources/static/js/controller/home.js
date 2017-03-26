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

                    self.addRemoveEventSource(self.eventSources, self.googleEvents);
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
    self.invitedEvents = [];
    let accepted= [];
    self.acceptedEvents= [];
    self.pastAcceptedEvents= [];

    let updateData = function () {

        if (!user.manager) {
            jobService.getInvitedJobs(user.id).then(function (response) {
                invited = response.data;
                self.invited = invited;
                // for (inv in self.invited){
                //     inv.startDate = new Date(inv.startDate);
                // }
                angular.forEach(invited, function (value, key) {
                    // console.log(key + ': ' + );
                    invited[key].startDate = new Date(value.startDate);

                    if (invited[key].startDate > today) {
                        self.invitedEvents.push({
                            title: invited[key].company.name,
                            start: invited[key].startDate,
                            className: 'invitedEvent',
                            url: '/#/job/view/' + invited[key].user.id
                            // backgroundColor: "#ff374b",
                            // stick: true
                        })
                    }
                });
            });

            jobService.getAcceptedJobs(user.id).then(function (response) {
                accepted = response.data;
                self.accepted = accepted;

                angular.forEach(accepted, function (value, key) {

                    accepted[key].startDate = new Date(value.startDate);

                    if (accepted[key].startDate > today) {
                        self.acceptedEvents.push({
                            title: accepted[key].company.name,
                            start: accepted[key].startDate,
                            className: 'acceptedEvent',
                            url: '/#/job/view/' + accepted[key].id
                        })
                    } else {
                        self.pastAcceptedEvents.push({
                            title: accepted[key].company.name,
                            start: accepted[key].startDate,
                            className: 'pastAcceptedEvent',
                            url: '/#/job/view/' + accepted[key].id
                        })
                    }
                });
            });

            self.invEvents = {
                events: self.invitedEvents
            };

            self.accEvents = {
                events: self.acceptedEvents
            };

            self.pastAccEvents = {
                events: self.pastAcceptedEvents
            };

            self.eventSources = [self.invEvents, self.accEvents, self.pastAccEvents];

        } else if (user.manager) {

            self.past = [];
            self.upcoming = [];

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
                        self.past.push(eventItem);
                    } else {
                        eventItem.className = 'acceptedEvent';
                        self.upcoming.push(eventItem);
                    }
                });
            });

            self.pastEvents = {
                events: self.past
            };

            self.upcomingEvents = {
                events: self.upcoming
            };

            self.eventSources = [self.pastEvents, self.upcomingEvents];
            uiCalendarConfig.calendars.myCalendar.fullCalendar('addEventSource', self.upcomingEvents);

            gapi.load('client:auth2', initClient);
        }

        const date = new Date();
        const d = date.getDate();
        const m = date.getMonth();
        const y = date.getFullYear();

        /* alert on eventClick */
        self.alertOnEventClick = function (date, jsEvent, view) {
            self.alertMessage = (date.title + ' was clicked ');
        };
        /* alert on Drop */
        self.alertOnDrop = function (event, delta, revertFunc, jsEvent, ui, view) {
            self.alertMessage = ('Event Droped to make dayDelta ' + delta);
        };
        /* alert on Resize */
        self.alertOnResize = function (event, delta, revertFunc, jsEvent, ui, view) {
            self.alertMessage = ('Event Resized to make dayDelta ' + delta);
        };
        /* add and removes an event source of choice */
        self.addRemoveEventSource = function (sources, source) {
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
        self.addEvent = function () {
            self.events.push({
                title: 'Open Sesame',
                start: new Date(y, m, 28),
                end: new Date(y, m, 29),
                className: ['openSesame']
            });
        };
        /* remove event */
        self.remove = function (index) {
            self.events.splice(index, 1);
        };
        /* Change View */
        self.changeView = function (view, calendar) {
            uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
        };
        /* Change View */
        self.renderCalender = function (calendar) {
            if (uiCalendarConfig.calendars[calendar]) {
                uiCalendarConfig.calendars[calendar].fullCalendar('render');
            }
        };
        /* Render Tooltip */
        self.eventRender = function (event, element, view) {
            element.attr({
                'tooltip': event.title,
                'tooltip-append-to-body': true
            });
            $compile(element)(self);
        };
        /* config object */
        $scope.uiConfig = {
            calendar: {
                timeFormat: 'HH:mm',
                height: 550,
                editable: false,
                header: {
                    left: 'title',
                    center: '',
                    right: 'today prev,next'
                },
                eventClick: self.alertOnEventClick,
                eventDrop: self.alertOnDrop,
                eventResize: self.alertOnResize,
                eventRender: self.eventRender
            }
        };
    }

});