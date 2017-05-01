angular.module('myApp').controller('home', function($http, $scope, $rootScope, jobService, $location, $cookies,
                                                    userService, $compile, uiCalendarConfig, $route) {

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
        if (isSignedIn) {
            self.gConnected = true;
            gapi.client.calendar.events.list({
                'calendarId': 'primary',
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 100,
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
                            className: 'gCalEvent',
                            url: event.htmlLink
                        };
                        $scope.gEvents.push(eventItem);
                    }
                    // gcal-event
                    self.googleEvents = {
                        events: self.gEvents
                    };
                } else {
                    console.log('No upcoming events found.');
                }
            });
        } else {
            self.gConnected = false;
            console.log("NOT SIGNED IN");
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
            // $scope.gEvents = [];


            gapi.load('client:auth2', initClient);
        } else if (user.manager) {

            $scope.past = [];
            $scope.upcoming = [];

            jobService.getEmployeesJobs(user.id).then(function (response) {
                let created = response.data;

                angular.forEach(created, function (value, key) {

                    created[key].startDate = new Date(value.startDate);

                    let eventItem = {
                        title: created[key].company.name,
                        start: created[key].startDate,
                        className: 'pastAcceptedEvent',
                        url: '/#/job/view/' + created[key].id
                    };

                    if (created[key].startDate - Date.now() < 0) {
                        $scope.pastAcceptedEvents.push(eventItem);
                    } else {
                        eventItem.className = 'acceptedEvent';
                        $scope.acceptedEvents.push(eventItem);
                    }
                });
            });

            // $scope.pastEvents = {
            //     events: $scope.past
            // };
            //
            // $scope.upcomingEvents = {
            //     events: $scope.upcoming
            // };
            //
            // $scope.gEvents = [];

            // $scope.eventSources = [$scope.past, $scope.upcoming, $scope.gEvents];

            gapi.load('client:auth2', initClient);
        }
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
            timeFormat: 'HH:mm',
            height: 550,
            editable: true,
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
    $scope.gEvents = [];
    /* event sources array*/
    $scope.eventSources = [$scope.invitedEvents, $scope.acceptedEvents, $scope.pastAcceptedEvents, $scope.gEvents];
    $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];

    let REDIRECT_URI = 'http://localhost:8080';
    var queryString = location.hash.substring(1);

    // Parse query string to see if page request is coming from OAuth 2.0 server.
    var params = {};
    var regex = /([^&=]+)=([^&]*)/g, m;
    while (m = regex.exec(queryString)) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        // Try to exchange the param values for an access token.
        exchangeOAuth2Token(params);
    }

    // If there's an access token, try an API request.
    // Otherwise, start OAuth 2.0 flow.
    function trySampleRequest() {
        var params = JSON.parse(localStorage.getItem('oauth2-test-params'));
        if (params && params['access_token']) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET',
                'https://www.googleapis.com/drive/v3/about?fields=user&' +
                'access_token=' + params['access_token']);
            xhr.onreadystatechange = function (e) {
                console.log(xhr.response);
            };
            xhr.send(null);
        } else {
            oauth2SignIn();
        }
    }

    /*
     * Create form to request access token from Google's OAuth 2.0 server.
     */
    function oauth2SignIn() {
        // Google's OAuth 2.0 endpoint for requesting an access token
        var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

        // Create element to open OAuth 2.0 endpoint in new window.
        var form = document.createElement('form');
        form.setAttribute('method', 'GET'); // Send as a GET request.
        form.setAttribute('action', oauth2Endpoint);

        // Parameters to pass to OAuth 2.0 endpoint.
        var params = {'client_id': CLIENT_ID,
            'redirect_uri': REDIRECT_URI,
            'scope': 'https://www.googleapis.com/auth/calendar.readonly',
            'state': 'try_sample_request',
            'include_granted_scopes': 'true',
            'response_type': 'token'};

        // Add form parameters as hidden input values.
        for (var p in params) {
            var input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', p);
            input.setAttribute('value', params[p]);
            form.appendChild(input);
        }

        // Add form to page and submit it to open the OAuth 2.0 endpoint.
        document.body.appendChild(form);
        form.submit();
    }

    /* Verify the access token received on the query string. */
    function exchangeOAuth2Token(params) {
        var oauth2Endpoint = 'https://www.googleapis.com/oauth2/v3/tokeninfo';
        if (params['access_token']) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', oauth2Endpoint + '?access_token=' + params['access_token']);
            xhr.onreadystatechange = function (e) {
                var response = JSON.parse(xhr.response);
                console.log(response);
                // When request is finished, verify that the 'aud' property in the
                // response matches YOUR_CLIENT_ID.
                if (xhr.readyState == 4 &&
                    xhr.status == 200 &&
                    response['aud'] &&
                    response['aud'] == CLIENT_ID) {
                    // Store granted scopes in local storage to facilitate
                    // incremental authorization.
                    params['scope'] = response['scope'];
                    localStorage.setItem('oauth2-test-params', JSON.stringify(params) );
                    if (params['state'] == 'try_sample_request') {
                        trySampleRequest();
                    }
                } else if (xhr.readyState == 4) {
                    console.log('There was an error processing the token, another ' +
                        'response was returned, or the token was invalid.')
                }
            };
            xhr.send(null);
        }
    }
    self.connectGCal = function () {
        gapi.client.init({
            discoveryDocs: DISCOVERY_DOCS,
            clientId: CLIENT_ID,
            scope: SCOPES
        }).then(function () {
            let GoogleAuth;
            gapi.auth2.getAuthInstance().isSignedIn.get();
            GoogleAuth = gapi.auth2.getAuthInstance();
            GoogleAuth.signIn();
        });
        // trySampleRequest();
    };

    self.verify = function () {
        let REDIRECT_URI = 'http://localhost:8080';
        var queryString = location.hash.substring(1);

        // Parse query string to see if page request is coming from OAuth 2.0 server.
        var params = {};
        var regex = /([^&=]+)=([^&]*)/g, m;
        while (m = regex.exec(queryString)) {
            params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
            // Try to exchange the param values for an access token.
            exchangeOAuth2Token(params);
        }
    };

    self.signOut = function () {
        gapi.auth2.getAuthInstance().signOut();
        self.gConnected = false;
        $scope.gEvents = [];
        $route.reload();
    }

});