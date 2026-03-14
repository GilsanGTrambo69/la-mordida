// Service worker para notificaciones en segundo plano (Firebase Cloud Messaging).
// Credenciales: usa los mismos valores que NEXT_PUBLIC_FIREBASE_* en .env.local
// Para inyectar env en build o usar en tu dominio: GET /api/firebase-messaging-sw

importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'TU_API_KEY',
  projectId: 'TU_PROJECT_ID',
  messagingSenderId: 'TU_SENDER_ID',
  appId: 'TU_APP_ID'
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: payload.notification.icon || '/icon-192.png'
  })
})
