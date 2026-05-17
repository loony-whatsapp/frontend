importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// These values are replaced by the build — the service worker cannot read
// import.meta.env, so they are set via a runtime message from the main app.
let messaging = null;

self.addEventListener("message", (event) => {
  if (event.data?.type === "FIREBASE_CONFIG") {
    firebase.initializeApp(event.data.config);
    messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      const title = payload.notification?.title ?? "New message";
      const body  = payload.notification?.body  ?? "";
      self.registration.showNotification(title, {
        body,
        icon: "/favicon.png",
      });
    });
  }
});
