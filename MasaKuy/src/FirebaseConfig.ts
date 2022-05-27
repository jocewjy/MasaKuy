// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

import { rejects } from 'assert';
import { resolve } from 'dns';
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBsii6Ai8EQf4z7aEtr9imz6JDJEw2iAMM",
    authDomain: "masakuy-baf90.firebaseapp.com",
    projectId: "masakuy-baf90",
    storageBucket: "masakuy-baf90.appspot.com",
    messagingSenderId: "92732290011",
    appId: "1:92732290011:web:91a7b1ecaed6bd74596dfe",
    measurementId: "G-NSTJL89VTY"
};

const app = firebase.initializeApp(firebaseConfig);
// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export function getCurrUser() {
    return new Promise((resolve, reject) => {
        const unsubsrice = firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                resolve(user);
            }
            else{
                resolve(null)
            }
            unsubsrice()
        })
    })
}

export async function loginUser(email: string, password: string) {
    try {
        const res = await firebase.auth().signInWithEmailAndPassword(email, password)
        console.log(res)
        return true
    } catch (error) {
        console.log(error)
        // toast(error.message)
        return false
    }
}

export async function signupUser(username: string, email: string, phonenumber: string, password: string) {
    try {
        const res = await firebase.auth().createUserWithEmailAndPassword(email, password)
        console.log(res)
        return true
    } catch (error) {
        console.log(error)
        // toast(error.message)
        return false
    }
}

export default app