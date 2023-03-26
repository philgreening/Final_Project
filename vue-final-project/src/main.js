import "bootstrap/dist/css/bootstrap.css"
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import VueAxios from 'vue-axios'

import App from './App.vue'
import router from './router'

import "bootstrap/dist/js/bootstrap.js"

import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

//Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_APP_API_KEY,
    authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_APP_PROJECT_ID,
    storageBucket: import.meta.env.VITE_APP_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_APP_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_APP_ID,
    measurementId: import.meta.env.VITE_APP_MEASUREMENT_ID,
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);



// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

const pinia = createPinia();

axios.defaults.baseURL = 'http://127.0.0.1:8000'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faTrashCan, faPenToSquare} from '@fortawesome/free-regular-svg-icons'
import { faTriangleExclamation, faCirclePlus, faCheck, faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faTrashCan, faTriangleExclamation, faPenToSquare, faCirclePlus, faCheck, faArrowRightToBracket)

createApp(App).use(pinia).use(router).use(VueAxios, axios).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
export { auth, storage, app, firebaseui }