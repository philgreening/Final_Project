<template>
  <div class="container p-4 mt-3">
    <div class="row justify-content-center">
      <div class="col-5 p-4 shadow-lg text-center">
        <h1>Sign in </h1>
        <div id="firebaseui-auth-container" class="container p-4"></div>
        <div id="loader">Loading...</div>
        <h5>Or</h5>
        <p>Sign in with email and password</p>
        <div>
          <input type="text" placeholder="Email" v-model="email" />
        </div>
        <div class="p-4">
          <input type="password" placeholder="Password" v-model="password" />
        </div>
        <button class="btn btn-danger col-3" type="button" @click="login">
          Sign in
          <font-awesome-icon icon="arrow-right-to-bracket" size="xl" />
        </button>
        <p class="mt-3">Don't have an account? </p><router-link to="register">Register Here</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { signInWithEmailAndPassword, GoogleAuthProvider } from "firebase/auth";
import { auth, firebaseui } from '../main.js'
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from '../stores/userStore';
import axios from 'axios';


const router = useRouter();
const email = ref("");
const password = ref("");
const profile = ref("");
const userStore = useUserStore();

onMounted(() => {
  // Configure FirebaseUI with Google provider
  const uiConfig = {
    signInFlow: 'popup',
    signInOptions: [
      {
        provider: GoogleAuthProvider.PROVIDER_ID,
        customParameters: {
          prompt: 'select_account'
        },
      },
    ],
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        // Determine if the user is a new user or not
        const isNewUser = authResult.additionalUserInfo.isNewUser;
        profile.value = authResult.additionalUserInfo.profile;

        // If the user is new, register the user and redirect to registration page
        if (isNewUser) {
          register();
          router.push("/register-google");
        } else {
          // If the user is not new, redirect to the items page
          router.push("/items");
        }
        return true;
      },
       // Callback function when the FirebaseUI widget is rendered
      uiShown: function () {
        // Hide the loader.
        document.getElementById("loader").style.display = 'none';
      }
    },
  }
  // Initialize the FirebaseUI Widget using Firebase.
  let ui;
  ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

  ui.start("#firebaseui-auth-container", uiConfig);

  ui.disableAutoSignIn();
});

// Function to login with email and password
const login = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      router.push("/items");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
};

// Function to register the user after successful sign-in with Google
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
    })
    .catch((error) => {
      console.log(error.code);
    });
};
</script>