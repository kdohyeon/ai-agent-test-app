import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyBZJh0N_WrX90vNIcIvCqZwNmr0XS1ViJQ",
  authDomain: "ticket-book-90ee2.firebaseapp.com",
  projectId: "ticket-book-90ee2",
  storageBucket: "ticket-book-90ee2.firebasestorage.app",
  messagingSenderId: "59383435831",
  appId: "1:59383435831:web:4fa7c58aeb001621cee5b2",
  measurementId: "G-BB9M6CN222"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// export const functions = getFunctions(app);
