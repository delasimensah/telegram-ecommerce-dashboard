import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const config = {
  apiKey: "AIzaSyBmabtcGVWzeev-xdTCUFUg7O3-X-f7bG8",
  authDomain: "next-playground-8fdae.firebaseapp.com",
  projectId: "next-playground-8fdae",
  storageBucket: "next-playground-8fdae.appspot.com",
  messagingSenderId: "89427148810",
  appId: "1:89427148810:web:34e18d97c235452ba3dff3",
  measurementId: "G-B04ZL2XYT7",
};

const app = initializeApp(config);
export const auth = getAuth(app);
