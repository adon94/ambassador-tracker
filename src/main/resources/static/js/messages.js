angular.module('myApp').factory('Message', function($firebaseObject, $firebaseArray) {

    let messages = $firebaseArray(firebase.database().ref().child("messages"));

    let Message = {
        all: messages,
        create: function (message) {
            return messages.$add(message);
        },
        get: function (messageId) {
            return $firebaseObject(firebase.database().ref().child("messages").child(messageId));
        },
        delete: function (message) {
            return messages.$remove(message);
        }
    };

    return Message;
});


// angular.module('myApp').controller('messages', function($scope, Message, $rootScope, $cookies) {
//
//
//     $rootScope.authenticated = $cookies.get('authenticated');
//
//     if ($rootScope.authenticated) {
//
//         $rootScope.empUser = ($cookies.get('empUser') === 'true');
//
//         $rootScope.currentUser = JSON.parse($cookies.get('currentUser'));
//     }
//
//     $scope.user="Guest";
//
//     $scope.messages= Message.all;
//
//     $scope.inserisci = function(message){
//         message.user.id = $rootScope.currentUsert
//
//         Message.create(message);
//     };
// });

angular.module('myApp').controller('messages', function($scope, $rootScope, $cookies, $firebaseObject) {

    $rootScope.authenticated = $cookies.get('authenticated');
    $rootScope.empUser = ($cookies.get('empUser') === 'true');
    $rootScope.currentUser = JSON.parse($cookies.get('currentUser'));
    let userType;

    if ($rootScope.empUser) {
        userType = "emp";
    } else {
        userType = "ba";
    }


    // messaging.onMessage(function(payload) {
    //     console.log("Message received. ", payload);
    //     // ...
    // });
    $scope.data = {};

    $scope.data.from = userType + $rootScope.currentUser.id;

    let ref = firebase.database().ref().child("data");
    // download the data into a local object
    let syncObject = $firebaseObject(ref);
    // synchronize the object with a three-way data binding
    // click on `index.html` above to see it used in the DOM!
    syncObject.$bindTo($scope, "data");
});