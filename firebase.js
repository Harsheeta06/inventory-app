// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWwxGsSDvdSjobXBrvxV_t1zSiGHmmvoQ",
  authDomain: "inventoryapp-f1e99.firebaseapp.com",
  projectId: "inventoryapp-f1e99",
  storageBucket: "inventoryapp-f1e99.appspot.com",
  messagingSenderId: "964405345455",
  appId: "1:964405345455:web:d1836dd00ac963d8a4685a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {firestore}