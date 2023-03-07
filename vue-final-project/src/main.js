import "bootstrap/dist/css/bootstrap.css"
import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import VueAxios from 'vue-axios'

import App from './App.vue'
import router from './router'

// import './assets/main.css'
import "bootstrap/dist/js/bootstrap.js"

import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'


import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

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
const storage = getStorage(app);



// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

const pinia = createPinia();

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faTrashCan, faPenToSquare} from '@fortawesome/free-regular-svg-icons'
import { faTriangleExclamation, faCirclePlus, faCheck } from '@fortawesome/free-solid-svg-icons'


/* add icons to the library */
library.add(faTrashCan, faTriangleExclamation, faPenToSquare, faCirclePlus, faCheck)



createApp(App).use(pinia).use(router).use(VueAxios, axios).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
export { auth, storage, app, firebaseui }