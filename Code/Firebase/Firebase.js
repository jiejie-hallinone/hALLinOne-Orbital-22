// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7neqAZO9oCmW3Zifry1WLZGtYr0NSh7w",
  authDomain: "orbital-hallinone.firebaseapp.com",
  projectId: "orbital-hallinone",
  storageBucket: "orbital-hallinone.appspot.com",
  messagingSenderId: "71839753012",
  appId: "1:71839753012:web:c251ed7839a6100bd47b61"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { auth };