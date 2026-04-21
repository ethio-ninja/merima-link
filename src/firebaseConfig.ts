import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBt1-3rnhqIhE-UcxANirUmj3Pt6YwoM64',
  authDomain: 'merima-link.firebaseapp.com',
  projectId: 'merima-link',
  storageBucket: 'merima-link.firebasestorage.app',
  messagingSenderId: '334158619853',
  appId: '1:334158619853:web:00d641adcc0e5534863584',
  measurementId: 'G-0V6SK8Q3CH',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics =
  typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
