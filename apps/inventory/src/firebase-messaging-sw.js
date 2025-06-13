importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBpvk8oPhy4t6hjhJZH1fuhoGcW3eqY_60",
  authDomain: "angular-monorepo-eaed7.firebaseapp.com",
  projectId: "angular-monorepo-eaed7",
  storageBucket: "angular-monorepo-eaed7.firebasestorage.app",
  messagingSenderId: "79240643463",
  appId: "1:79240643463:web:7e836f0fcab9211a2f8922",
  measurementId: "G-3BLV2KEBXG"
})

const messaging = firebase.messaging()
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});