import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBHOKJRsEwV5f0rcSgIEoGgt2dx6yp0G_w",
  authDomain: "well-app-e4890.firebaseapp.com",
  projectId: "well-app-e4890",
  storageBucket: "well-app-e4890.appspot.com",
  messagingSenderId: "507200635139",
  appId: "1:507200635139:web:8ee8d26f8aa9869e3ee936",
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp)

const firestore = getFirestore(firebaseApp);
export { auth, firestore,storage, firebaseConfig, firebaseApp };
