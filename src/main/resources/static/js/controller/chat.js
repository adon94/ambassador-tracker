angular.module('myApp').controller('chat', function ($filter, $location, $routeParams, $rootScope, $cookies,
                                                     chatService, userService) {

    let self = this;
    let id = $routeParams.id;

    let user = {};

    let userId = $cookies.get('currentUser');
    if (userId != null) {
        userService.findOne(userId).then(function successCallback(response) {
            $rootScope.currentUser = response.data;
            user = $rootScope.currentUser;
            if (id != null) {
                updateData();
            } else {
                updateSideChats();
            }
        });
    }

    let updateData = function () {
        chatService.findOne(id).then(function successCallback(response) {
            self.currentChat = response.data;
        });

        updateSideChats();
    };

    let updateSideChats = function () {
        chatService.findByParticipants($rootScope.currentUser.id).then(function successCallback(response) {
            self.allChats = response.data;
        });
    };

    self.sendMessage = function () {
        self.message.sender = user;
        self.message.timestamp = new Date();
        self.currentChat.messages.push(self.message);
        chatService.create(self.currentChat).then(function successCallback(response) {
            self.currentChat = response.data;
            self.message.text = null;
            updateSideChats();
        })
    };

    self.openChat = function (chat) {
        self.currentChat = chat;
    }
});