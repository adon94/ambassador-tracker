// let chat = angular.module( 'myApp', ['chat'] );
// angular.module('chat').constant('config', {
//     rltm: {
//         service: "pubnub",
//         config: {
//             publishKey: "pub-c-312fc876-89af-447d-b4eb-f369e54e3e75",
//             subscribeKey: "sub-c-73aee85c-074e-11e7-89e8-02ee2ddab7fe"
//         }
//     }
// });

angular.module('myApp').controller('messages', ['Messages', '$scope', function(Messages, $scope) {

    // Message Inbox
    $scope.messages = [];
    // Receive Messages
    Messages.receive(function(message) {
        $scope.messages.push(message);
        console.log("Received "+message);
    });
    // Send Messages
    $scope.send = function() {
        Messages.send({
            data: $scope.textbox
        });
        console.log("Sent "+$scope.textbox);
    };
}]);