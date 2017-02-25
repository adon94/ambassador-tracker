angular.module('myApp', [ 'ngRoute', 'ui.bootstrap', 'ui.calendar', 'ngFileUpload', 'ngImgCrop', 'ngCookies' ])
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
        .when('/user/new', {
        templateUrl : 'view/register.html',
        controller : 'user',
        controllerAs: 'controller'
    })
        .otherwise('/');

});