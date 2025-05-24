import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAlF570wZc1ai0V_PhpjR8oq9e1bcEhuaY",
  authDomain: "mini--application.firebaseapp.com",
  projectId: "mini--application",
  storageBucket: "mini--application.firebasestorage.app",
  messagingSenderId: "220340755925",
  appId: "1:220340755925:web:3e6f8253337c57d49f715c",
  measurementId: "G-0FC9VPF9F6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, db };