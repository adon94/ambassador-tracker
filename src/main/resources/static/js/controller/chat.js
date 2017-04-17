angular.module('myApp').controller('chat', function ($filter, $location, $routeParams, $rootScope, $cookies,
                                                     chatService, userService, $interval) {

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


    $interval(updateSideChats, 5000);

    let updateData = function () {
        chatService.findOne(id).then(function successCallback(response) {
            self.currentChat = response.data;
        });

        updateSideChats();
    };

    function updateSideChats() {
        chatService.findByParticipants($rootScope.currentUser.id).then(function successCallback(response) {
            self.allChats = response.data;
        });

        userService.all().then(function successCallback(response) {
            self.allUsers = response.data;
        });

        if (self.currentChat != null) {
            chatService.findOne(self.currentChat.id).then(function successCallback(response) {
                if (response.data.messages.length > self.currentChat.messages.length) {
                    self.currentChat = response.data;
                }
            });
        }
    }

    self.sendMessage = function () {
        if (self.message.text != "" && self.message.text != null) {
            self.message.sender = user;
            self.message.timestamp = new Date();
            self.currentChat.messages.push(self.message);
            chatService.create(self.currentChat).then(function successCallback(response) {
                self.currentChat = response.data;
                self.message.text = null;
                updateSideChats();
            })
        }
    };

    self.openChat = function (chat) {
        self.currentChat = chat;
    };

    self.onUserSelect = function (selected) {

        let chat = {};
        chat.participants = [];
        chat.participants.push(user);
        chat.participants.push(selected.originalObject);
        console.log(selected.originalObject);
        chatService.userChat(chat).then(function successCallback(response) {
            self.currentChat = response.data;
            if (self.currentChat.messages == null){
                self.currentChat.messages = [];
            }
            console.log(response.data);
        });
    };
});