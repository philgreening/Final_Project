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
let appp


// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

const pinia = createPinia();

// watch(
//     pinia.state,
//     (state) => {
//       // persist the whole state to the local storage whenever it changes
//       localStorage.setItem('piniaState', JSON.stringify(state))
//     },
//     { deep: true }
//   )

// Sets a persistant store session
// if(localStorage.getItem("state")) {
//     pinia.state.value = JSON.parse(localStorage.getItem("state"));
// };

// watch(
//     pinia.state,
//     (state) => {
//         localStorage.setItem("state", JSON.stringify(state));
//     },
//     { deep: true}
// );
// auth.onAuthStateChanged(()=>{
//     if(!appp) {
//         createApp(App).use(pinia).use(router).use(VueAxios, axios).mount('#app')
//     }
// })

createApp(App).use(pinia).use(router).use(VueAxios, axios).mount('#app')
export { auth }


