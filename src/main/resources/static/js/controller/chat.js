angular.module('myApp').controller('chat', function ($filter, $location, $routeParams, $rootScope, $cookies,
                                                     chatService, userService, $anchorScroll) {

    let self = this;
    let id = $routeParams.id;

    let user = {};

    let userId = $cookies.get('currentUser');
    if (userId != null) {
        userService.findOne(userId).then(function successCallback(response) {
            $rootScope.currentUser = response.data;
            user = $rootScope.currentUser;
            updateData();
        });
    }

    let updateData = function () {
        chatService.findOne(id).then(function successCallback(response) {
            self.currentChat = response.data;
        });

        chatService.findByParticipants($rootScope.currentUser.id).then(function successCallback(response) {
            self.allChats = response.data;
        })
    };

    self.sendMessage = function () {
        self.message.sender = user;
        self.message.timestamp = new Date();
        self.currentChat.messages.push(self.message);
        chatService.create(self.currentChat).then(function successCallback(response) {
            self.currentChat = response.data;
            self.message.text = null;
        })
    };

    self.openChat = function (chat) {
        // let newHash = 'anchor' + (chat.messages.length - 1);
        self.currentChat = chat;
        // if ($location.hash() !== newHash) {
        //     // set the $location.hash to `newHash` and
        //     // $anchorScroll will automatically scroll to it
        //     $location.hash(newHash);
        // } else {
        //     // call $anchorScroll() explicitly,
        //     // since $location.hash hasn't changed
        //     $anchorScroll();
        // }
    }
});