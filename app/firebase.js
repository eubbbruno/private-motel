import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCZD25GDrWZk3nvVyS4e6nOzyW-itp5uro",
  authDomain: "private-reservas.firebaseapp.com",
  projectId: "private-reservas",
  storageBucket: "private-reservas.firebasestorage.app",
  messagingSenderId: "854952992105",
  appId: "1:854952992105:web:9b7e0c9cb07ddcbce1b1f8",
  measurementId: "G-BSCD65MR0X"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);