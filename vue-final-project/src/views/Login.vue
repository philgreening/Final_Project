<template>
  <div class="container p-4 text-center">
    <h1>Sign in </h1>
    <!-- <h1>Log in to an Account</h1>
    <p><input type="text" placeholder="Email" v-model="email" /></p>
    <p><input type="password" placeholder="Password" v-model="password" /></p>
    <p><button @click="login">Submit</button></p>
    <p><button @click="signInWithGoogle">Sign in with Google</button></p> -->
 
    <div id="firebaseui-auth-container" class="container p-4"></div>
    <div id="loader">Loading...</div>
    <p>Or</p>
      <div>
        <input type="text" placeholder="Email" v-model="email" />
      </div>
    <div class="p-4">
    <input type="password" placeholder="Password" v-model="password" />
    </div>
    <button class="btn btn-danger col-2" type="button" @click="login">Sign in</button>
  </div>
    
</template>

<script setup>
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, EmailAuthProvider } from "firebase/auth";
import { auth, firebaseui, app } from '../main.js'
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from '../stores/userStore';
import axios from 'axios';


// import firebase  from 'firebase/compat/app'

const router = useRouter();
const email = ref("");
const password = ref("");
const profile = ref("");
const userStore = useUserStore();

const username = null;

onMounted(()=>{

const uiConfig = {
  signInFlow: 'popup',
  // signinSuccessURL:'/items',
  signInOptions: [
    {
    provider: GoogleAuthProvider.PROVIDER_ID,
    customParameters:{
      prompt: 'select_account'
    },
    },
  ],
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl){
      console.log("authresult:",authResult.additionalUserInfo.profile)

      const isNewUser = authResult.additionalUserInfo.isNewUser;
      profile.value = authResult.additionalUserInfo.profile;
      console.log(profile.value.given_name);

      if(isNewUser){
        register();
        router.push("/register-google");
      }else{
        router.push("/items");
      }

      return true;
    },
    uiShown: function() {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById("loader").style.display = 'none';
    }
  },
}
// Initialize the FirebaseUI Widget using Firebase.
// let ui = new firebaseui.auth.AuthUI(auth);
let ui;
ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

ui.start("#firebaseui-auth-container", uiConfig);

ui.disableAutoSignIn();
});

// const auth = getAuth();
const login = () => {
    signInWithEmailAndPassword(auth, email.value, password.value)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // console.log("userlogin:",user);
    router.push("/items");
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
  });
};

const register = () => {
  
      const formData = {
        id: userStore.user.id,
        first_name: profile.value.given_name,
        last_name: profile.value.family_name,
        email: profile.value.email,
        address: "",
        admin: false
      };

      axios.post("/api/v1/users", formData)
    .then((response) => {
                    console.log("response: ", response.data);
                })
    .catch((error) => {
      console.log(error.code);
    });
};
    

</script>