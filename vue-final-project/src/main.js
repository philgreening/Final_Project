import "bootstrap/dist/css/bootstrap.css"
import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import VueAxios from 'vue-axios'

import App from './App.vue'
import router from './router'

// import './assets/main.css'
import "bootstrap/dist/js/bootstrap.js"


import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "AIzaSyCDqf1KgJPE8CkHzL3quKcILcRo6Xo_8XM",
    authDomain: "final-project-afe71.firebaseapp.com",
    projectId: "final-project-afe71",
    storageBucket: "final-project-afe71.appspot.com",
    messagingSenderId: "7143544341",
    appId: "1:7143544341:web:59d9d4eb128c77e3a0a01c",
    measurementId: "G-SSXQSXDBT6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

const pinia = createPinia();

// Sets a persistant store session
if(localStorage.getItem("state")) {
    pinia.state.value = JSON.parse(localStorage.getItem("state"));
};

watch(
    pinia.state,
    (state) => {
        localStorage.setItem("state", JSON.stringify(state));
    },
    { deep: true}
);

createApp(App).use(pinia).use(router).use(VueAxios, axios).mount('#app')


