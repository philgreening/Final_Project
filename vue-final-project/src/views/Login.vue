<template>
  <div class="container-fluid">
    <h1>Log in to an Account</h1>
    <p><input type="text" placeholder="Email" v-model="email" /></p>
    <p><input type="password" placeholder="Password" v-model="password" /></p>
    <p><button @click="login">Submit</button></p>
    <p><button @click="signInWithGoogle">Sign in with Google</button></p>
  </div>
    
</template>

<script setup>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const email = ref("");
const password = ref("");

const auth = getAuth();
const login = () => {
    signInWithEmailAndPassword(auth, email.value, password.value)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log("user:",user);
    router.push("/");
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
  });
};
    

</script>