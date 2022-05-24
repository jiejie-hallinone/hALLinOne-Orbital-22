// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMG57ldMVlSdTdDjLWOTO5QG7g77dhTOQ",
  authDomain: "hallinone-e5b50.firebaseapp.com",
  projectId: "hallinone-e5b50",
  storageBucket: "hallinone-e5b50.appspot.com",
  messagingSenderId: "704798672696",
  appId: "1:704798672696:web:e30a2a7aab5a8de3a263cd",
  measurementId: "G-F4SJ4MNEF2"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
} else {
    app = firebase.app()
}

const auth = firebase.auth()

export { auth };