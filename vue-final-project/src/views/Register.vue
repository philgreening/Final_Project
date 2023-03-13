<template>
  <div class="container col-3 p-4 shadow-lg my-5 text-center">
    <p class="h3 p-2">Sign Up</p>
    <!-- </div> -->
    <form @submit.prevent="submitForm" class="needs-validation" novalidate>
      <!-- Password input -->
      <div class="input-group mb-3 has-validation">
        <div class="input-group-prepend">
          <span class="input-group-text">Password</span>
        </div>
        <input type="text" class="form-control" placeholder="Choose a password" v-model.lazy="password" required />
        <div class="invalid-feedback">
          Password must be at least 6 characters.
        </div>
      </div>
      <!-- Email input -->
      <div class="input-group mb-3 has-validation">
        <div class="input-group-prepend">
          <span class="input-group-text">Email</span>
        </div>
        <input type="email" class="form-control" placeholder="Email" v-model.lazy="email" required />
        <div class="invalid-feedback">Please input a valid email address.</div>
      </div>
      <!-- First name input -->
      <div class="input-group mb-3 has-validation">
        <div class="input-group-prepend">
          <span class="input-group-text">First name</span>
        </div>
        <input type="text" class="form-control" placeholder="First name" v-model.lazy="firstName" required />
        <div class="invalid-feedback">Please input your first name.</div>
      </div>
      <!-- Last name input -->
      <div class="input-group mb-3 has-validation">
        <div class="input-group-prepend">
          <span class="input-group-text">Last name</span>
        </div>
        <input type="text" class="form-control" placeholder="Last name" v-model.lazy="lastName" required />
        <div class="invalid-feedback">Please input your last name.</div>
      </div>
      <!-- Address input -->
      <div class="input-group mb-3 has-validation">
        <div class="input-group-prepend">
          <span class="input-group-text h-100">Address</span>
        </div>
        <textarea class="form-control" placeholder="Address" v-model.lazy="address" required></textarea>
        <div class="invalid-feedback">Please input an address.</div>
      </div>
      <!-- <div class="alert alert-success mb-3" role="alert" v-if="success.length">
                                <p class="text-center">{{ success }}</p>
                            </div> -->
      <button type="submit" class="btn btn-primary col-4">Sign up</button>
    </form>
    <!-- </div> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "vue-router";
import axios, { Axios } from "axios";
import { auth } from "../main";

const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account",
});

const router = useRouter();
const email = ref("");
const password = ref("");
const address = ref("");
const firstName = ref("");
const lastName = ref("");
// const success = ref([]);

//     onMounted(()=>{
//   // Render the Google sign-in button
//   gapi.signin2.render("google-sign-in", {
//     scope: "email",
//     width: 240,
//     height: 50,
//     longtitle: true,
//     theme: "light",
//     onsuccess: registerWithGoogle,
//     onfailure: onError
//   });
// });

// Handle form submission
const submitForm = (event) => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      console.log("called");
    } else {
      register();
      // this.success = "Details updated";
    }
    form.classList.add("was-validated");
  });
};

const register = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
      console.log("Succesfully registered!");
      console.log(data.user.uid);
      const uid = data.user.uid;
      const userEmail = data.user.email;

      const formData = {
        id: uid,
        first_name: firstName.value,
        last_name: lastName.value,
        address: address.value,
        email: userEmail,
      };

      axios.post("/api/v1/users", formData);

      router.push("/items");
    })
    .catch((error) => {
      console.log(error.code);
      alert(error.message);
    });
};

const registerWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      // credentialFromResult(result);
      const user = result.user;
      console.log(user);
      // myModal.show();
      console.log("sign in result: ", result);
      // router.push('/items');
    })
    .catch((error) => {
      console.log(error);
    });
};

const onError = () => {
  alert("Error occurred while signing in with Google.");
};
</script>

<style scoped>
#google-sign-in {
  margin: auto;
}
</style>
