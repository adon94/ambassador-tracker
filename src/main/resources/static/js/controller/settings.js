angular.module('myApp').controller('settings', function ($scope, $cookies, $rootScope) {
    $rootScope.authenticated = $cookies.get('authenticated');

    if ($rootScope.authenticated) {

        $rootScope.empUser = ($cookies.get('empUser') === 'true');

        $rootScope.currentUser = JSON.parse($cookies.get('currentUser'));
    }

    // Client ID and API key from the Developer Console
    let CLIENT_ID = '1009962031783-q0gk1vg0u75t51m5iphhqi4a15883t39.apps.googleusercontent.com';

    // Array of API discovery doc URLs for APIs used by the quickstart
    let DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    let SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

    let authorizeButton = document.getElementById('authorize-button');
    let signoutButton = document.getElementById('signout-button');

    let GoogleAuth;

    $scope.handleClientLoad = function() {
        gapi.load('client:auth2', initClient);
    };

    function initClient() {
        gapi.client.init({
            discoveryDocs: DISCOVERY_DOCS,
            clientId: CLIENT_ID,
            scope: SCOPES
        }).then(function () {
            GoogleAuth = gapi.auth2.getAuthInstance();
            // Listen for sign-in state changes.
            GoogleAuth.isSignedIn.listen(updateSigninStatus);
            // $cookies.put('gapi', JSON.stringify(gapi));

            // Handle the initial sign-in state.
            updateSigninStatus(GoogleAuth.isSignedIn.get());
            // authorizeButton.onclick = handleAuthClick;
            signoutButton.onclick = handleSignoutClick;
        });
    }

    function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
    }

    function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
            let googleUser = GoogleAuth.currentUser.get();
            console.log(googleUser.Zi);
            authorizeButton.style.display = 'none';
            signoutButton.style.display = 'block';
            listUpcomingEvents();
        } else {
            authorizeButton.style.display = 'block';
            signoutButton.style.display = 'none';
        }
    }

    $scope.authClick = function () {
        GoogleAuth.signIn();
    };

    function appendPre(message) {
        let pre = document.getElementById('content');
        let textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
    }

    function listUpcomingEvents() {
        gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            'orderBy': 'startTime'
        }).then(function (response) {
            let events = response.result.items;
            appendPre('Upcoming events:');

            if (events.length > 0) {
                for (i = 0; i < events.length; i++) {
                    let event = events[i];
                    let when = event.start.dateTime;
                    if (!when) {
                        when = event.start.date;
                    }
                    appendPre(event.summary + ' (' + when + ')')
                }
            } else {
                appendPre('No upcoming events found.');
            }
        });
    }
});