importScripts('https://www.gstatic.com/firebasejs/3.6.6/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.6.6/firebase-messaging.js');

// Initialize Firebase
let config = {
    apiKey: "AIzaSyBkt6sGzu2K-kqmRzUUhgc01o3NQHTaZ-s",
    authDomain: "ambassadortracker.firebaseapp.com",
    databaseURL: "https://ambassadortracker.firebaseio.com",
    storageBucket: "ambassadortracker.appspot.com",
    messagingSenderId: "1009962031783"
};
firebase.initializeApp(config);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
    const title = 'Hello World';
    const options = {
        body: payload.data.status
    };

    return self.registeration.showNotification(title, options);
});