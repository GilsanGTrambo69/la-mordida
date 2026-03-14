import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Sirve el firebase-messaging-sw.js con las credenciales inyectadas.
 * Útil cuando el widget se usa en el mismo dominio que PushNoti.
 * Para sitios externos, los clientes deben hospedar el SW en su dominio
 * (copiando public/firebase-messaging-sw.js y reemplazando placeholders).
 */
export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? 'TU_API_KEY'
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'TU_PROJECT_ID'
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? 'TU_SENDER_ID'
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? 'TU_APP_ID'

  const body = `importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: ${JSON.stringify(apiKey)},
  projectId: ${JSON.stringify(projectId)},
  messagingSenderId: ${JSON.stringify(messagingSenderId)},
  appId: ${JSON.stringify(appId)}
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: payload.notification.icon || '/icon-192.png'
  });
});
`

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Service-Worker-Allowed': '/',
    },
  })
}
