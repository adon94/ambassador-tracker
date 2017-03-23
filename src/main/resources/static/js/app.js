angular.module('myApp', [ 'ngRoute', 'ui.calendar', 'ngCookies', 'moment-picker', 'firebase' ])
    .config(function($routeProvider, $locationProvider) {

        $locationProvider.hashPrefix('');

    $routeProvider
        .when('/', {
        templateUrl : 'view/home.html',
        controller : 'home',
        controllerAs: 'controller'
    })
        .when('/login', {
        templateUrl : 'view/login.html',
        controller : 'navigation',
        controllerAs: 'controller'
    })
        .when('/job/new', {
        templateUrl : 'view/create-job.html',
        controller : 'job',
        controllerAs: 'controller'
    })
        .when('/job/view/:id', {
        templateUrl : 'view/view-job.html',
        controller : 'view-job',
        controllerAs: 'controller'
    })
        .when('/ba/view/:id', {
        templateUrl : 'view/view-ba.html',
        controller : 'view-ba',
        controllerAs: 'controller'
    })
        .when('/emp/view/:id', {
        templateUrl : 'view/view-emp.html',
        controller : 'view-emp',
        controllerAs: 'controller'
    })
        .when('/register', {
        templateUrl : 'view/register.html',
        controller : 'user',
        controllerAs: 'controller'
    })
        .when('/ba/wages', {
        templateUrl : 'view/wages.html',
        controller : 'wages',
        controllerAs: 'controller'
    })
        .when('/settings', {
        templateUrl : 'view/settings.html',
        controller : 'settings',
        controllerAs: 'controller'
    })
        .when('/expenses', {
        templateUrl : 'view/expenses.html',
        controller : 'expenses',
        controllerAs: 'controller'
    })
        .when('/messages', {
        templateUrl : 'view/messages.html',
        controller : 'messages',
        controllerAs: 'controller'
    })
        .otherwise('/');

        const messaging = firebase.messaging();

        messaging.requestPermission()
            .then(function () {
                console.log("All good");
                return messaging.getToken();
            })
            .then(function (token) {
                console.log(token);
            })
            .catch(function (err) {
                console.log("Error occured: "+err);
            });
        messaging.onMessage(function (payload) {
            console.log("onMessage: " + payload)
        });
});