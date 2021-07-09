import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import firebase from 'firebase'


//Required for side - effects
require("firebase/firestore");

var firebaseConfig = {
    apiKey: "AIzaSyAPPU9vqNO5meWDSll23cOZgBQvx-Q_3mA",
    authDomain: "chatterbot-6f94a.firebaseapp.com",
    projectId: "chatterbot-6f94a",
    storageBucket: "chatterbot-6f94a.appspot.com",
    messagingSenderId: "251310745170",
    appId: "1:251310745170:web:c5b9891e021391b95f618b",
    measurementId: "G-KFRSVWESHL"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

window.db = db;
//Disable deprecated features
db.settings({
    timestampsInSnapShots: true
});

createApp(App).use(store).use(router).mount('#app')