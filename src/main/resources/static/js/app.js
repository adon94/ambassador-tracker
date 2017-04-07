angular.module('myApp', [ 'ngRoute', 'ui.calendar', 'ngCookies', 'moment-picker', 'toastr', 'luegg.directives' ])
    .config(function($routeProvider, $locationProvider, toastrConfig) {

        $locationProvider.hashPrefix('');

        $routeProvider
            .when('/', {
            templateUrl : 'view/home.html',
            controller : 'home',
            controllerAs: 'ctrl'
        })
            .when('/login', {
            templateUrl : 'view/login.html',
            controller : 'login',
            controllerAs: 'ctrl'
        })
            .when('/account', {
            templateUrl : 'view/account.html',
            controller : 'account',
            controllerAs: 'ctrl'
        })
            .when('/job/new', {
            templateUrl : 'view/create-job.html',
            controller : 'createJob',
            controllerAs: 'ctrl'
        })
            .when('/job/view/:id', {
            templateUrl : 'view/view-job.html',
            controller : 'view-job',
            controllerAs: 'ctrl'
        })
            .when('/chat/:id?', {
            templateUrl : 'view/chat.html',
            controller : 'chat',
            controllerAs: 'ctrl'
        })
            .when('/profile/:id', {
            templateUrl : 'view/profile.html',
            controller : 'profile',
            controllerAs: 'ctrl'
        })
            .when('/register', {
            templateUrl : 'view/register.html',
            controller : 'user',
            controllerAs: 'controller'
        })
            .when('/ba/wages', {
            templateUrl : 'view/wages.html',
            controller : 'wages',
            controllerAs: 'ctrl'
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
            controllerAs: 'ctrl'
        })
            .otherwise('/');

        angular.extend(toastrConfig, {
            autoDismiss: false,
            containerId: 'toast-container',
            maxOpened: 0,
            newestOnTop: false,
            positionClass: 'toast-bottom-right',
            preventDuplicates: false,
            preventOpenDuplicates: false,
            target: 'body'
        });
});