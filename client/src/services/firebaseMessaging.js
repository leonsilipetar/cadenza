import { initializeApp } from "@firebase/app";
import { getMessaging, getToken, onMessage } from "@firebase/messaging";
import ApiConfig from '../components/apiConfig.js';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
      });
      
      // Send this token to your server to save it for the user
      await saveTokenToServer(token);
      return token;
    }
    throw new Error('Notification permission denied');
  } catch (error) {
    console.error('Notification permission error:', error);
    throw error;
  }
};

const saveTokenToServer = async (token) => {
  try {
    const response = await fetch(`${ApiConfig.baseUrl}/api/notifications/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
      credentials: 'include'
    });
    
    if (!response.ok) {
      console.warn('Failed to save notification token, but continuing...');
    }
  } catch (error) {
    console.warn('Error saving token, but continuing...', error);
  }
};

export const onMessageListener = () => {
  return new Promise((resolve) => {
    const unsubscribe = onMessage(messaging, (payload) => {
      resolve(payload);
    });
    return unsubscribe; // Return the unsubscribe function
  });
}; 