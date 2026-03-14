import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

const FIREBASE_APP_CDN = 'https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js'
const FIREBASE_MESSAGING_CDN = 'https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js'

function getScript(tenantId: string): string {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
  }
  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ?? ''
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

  return `(function(){
  var tenantId = ${JSON.stringify(tenantId)};
  var config = ${JSON.stringify(config)};
  var vapidKey = ${JSON.stringify(vapidKey)};
  var supabaseUrl = ${JSON.stringify(supabaseUrl)};
  var supabaseAnonKey = ${JSON.stringify(supabaseAnonKey)};

  function getDeviceType() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
  }
  function getBrowser() {
    var ua = navigator.userAgent;
    if (ua.indexOf('Firefox') > -1) return 'Firefox';
    if (ua.indexOf('Edg') > -1) return 'Edge';
    if (ua.indexOf('Chrome') > -1) return 'Chrome';
    if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) return 'Safari';
    if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) return 'Opera';
    return 'Other';
  }
  function saveToken(token) {
    return fetch(supabaseUrl + '/rest/v1/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': 'Bearer ' + supabaseAnonKey,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        tenant_id: tenantId,
        fcm_token: token,
        device_type: getDeviceType(),
        browser: getBrowser(),
        status: 'active'
      })
    });
  }
  function loadScript(src) {
    return new Promise(function(resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  function run() {
    if (typeof firebase === 'undefined') {
      setTimeout(run, 50);
      return;
    }
    firebase.initializeApp(config);
    var messaging = firebase.messaging();
    Notification.requestPermission().then(function(permission) {
      if (permission !== 'granted') return;
      messaging.getToken({ vapidKey: vapidKey }).then(function(token) {
        if (token) saveToken(token);
      }).catch(function(err) { console.warn('PushNoti: getToken failed', err); });
    }).catch(function(err) { console.warn('PushNoti: requestPermission failed', err); });
  }
  loadScript(${JSON.stringify(FIREBASE_APP_CDN)}).then(function() {
    return loadScript(${JSON.stringify(FIREBASE_MESSAGING_CDN)});
  }).then(run).catch(function(err) { console.warn('PushNoti: script load failed', err); });
})();`
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ tenantId: string }> }
) {
  const { tenantId } = await context.params
  if (!tenantId) {
    return new Response('Missing tenantId', { status: 400 })
  }

  const script = getScript(tenantId)

  return new Response(script, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  })
}
