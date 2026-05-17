import { useEffect } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { authFetch } from "../lib/auth";
import { API_URL } from "../Config";

const FIREBASE_CONFIG = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

function isFirebaseConfigured(): boolean {
  return !!(FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId && VAPID_KEY);
}

async function registerFcmToken(fcmToken: string): Promise<void> {
  await authFetch(`${API_URL}/users/fcm-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fcm_token: fcmToken }),
  });
}

/**
 * Request notification permission, obtain an FCM token, and register it with
 * the backend so the notification consumer can deliver push messages when this
 * user is offline.
 *
 * Only runs when VITE_FIREBASE_* env vars are set — safe to include without
 * a Firebase project configured.
 */
export function usePushNotifications(userId: number | undefined): void {
  useEffect(() => {
    if (!userId || !isFirebaseConfigured()) return;
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;

    let cancelled = false;

    (async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted" || cancelled) return;

        await navigator.serviceWorker.register("/firebase-messaging-sw.js");

        const app = getApps().length
          ? getApps()[0]
          : initializeApp(FIREBASE_CONFIG);
        const messaging = getMessaging(app);

        const fcmToken = await getToken(messaging, { vapidKey: VAPID_KEY });
        if (fcmToken && !cancelled) {
          await registerFcmToken(fcmToken);
        }

        // Handle foreground messages (app is open)
        onMessage(messaging, (payload) => {
          const title = payload.notification?.title ?? "New message";
          const body  = payload.notification?.body  ?? "";
          // Show a browser notification even when the tab is focused
          if (Notification.permission === "granted") {
            new Notification(title, { body, icon: "/favicon.png" });
          }
        });
      } catch (err) {
        console.error("[fcm] push notification setup failed:", err);
      }
    })();

    return () => { cancelled = true; };
  }, [userId]);
}
