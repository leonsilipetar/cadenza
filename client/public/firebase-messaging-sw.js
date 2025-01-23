importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCulVokylkRYHA6wXnQkcEbO9b0pgON00w",
  authDomain: "cadenza-d5776.firebaseapp.com",
  projectId: "cadenza-d5776",
  storageBucket: "cadenza-d5776.firebasestorage.app",
  messagingSenderId: "975125523948",
  appId: "1:975125523948:web:86c084bdc5e3d7ae30a4c9"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/Logo192.png',
    badge: '/Logo192.png',
    data: payload.data,
    vibrate: [200, 100, 200],
    tag: payload.data.type || 'default',
    renotify: true,
    actions: [
      {
        action: 'open',
        title: 'Otvori',
      },
      {
        action: 'close',
        title: 'Zatvori',
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('/obavijesti') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/obavijesti');
      }
    })
  );
}); 