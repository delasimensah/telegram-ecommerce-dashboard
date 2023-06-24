import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const config = {
  apiKey: "AIzaSyC9Lb3MBd77BiwXHmDh-8Tw3-sIKRZZvjo",
  authDomain: "motive-5fd18.firebaseapp.com",
  projectId: "motive-5fd18",
  storageBucket: "motive-5fd18.appspot.com",
  messagingSenderId: "410646108820",
  appId: "1:410646108820:web:f566c39979a176c2217281",
};

const app = initializeApp(config);
export const auth = getAuth(app);
export const storage = getStorage(app);
