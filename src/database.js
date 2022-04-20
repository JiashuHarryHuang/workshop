// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCXClSH5ikO5L3gGl-blIFkojO-O79V5ec",
    authDomain: "todo-list-db44e.firebaseapp.com",
    projectId: "todo-list-db44e",
    storageBucket: "todo-list-db44e.appspot.com",
    messagingSenderId: "645345482152",
    appId: "1:645345482152:web:f4838b171b01365e05b99d",
    measurementId: "G-WPEQNGKQ89"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);