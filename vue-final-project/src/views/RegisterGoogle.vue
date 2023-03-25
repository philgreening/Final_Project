<template>
  <div class="container col-3 p-4 shadow-lg my-5 text-center">
    <p class="h3 p-2">Sign Up</p>
    <form @submit.prevent="submitForm" class="needs-validation" novalidate>
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
      <button type="submit" class="btn btn-primary col-5">Sign up
        <font-awesome-icon icon="arrow-right-to-bracket" size="xl" />
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios, { Axios } from "axios";
import { auth } from "../main";
import { useUserStore } from "../stores/userStore";
import { updateEmail } from "firebase/auth";

const userStore = useUserStore();

const router = useRouter();
const email = ref("");
const address = ref("");
const firstName = ref("");
const lastName = ref("");

const user = ref([]);
const currentUserId = ref("")

onMounted(() => {
  currentUserId.value = userStore.user.id;
  getUser();
});

// Gets the current user deatails via the API
const getUser = async () => {
  await axios
    .get("/api/v1/users/user/" + currentUserId.value, {
      headers: {
        Authorization: `Bearer ${userStore.authToken}`,
      },
    })
    .then((response) => {
      user.value = response.data;
      firstName.value = user.value.first_name;
      lastName.value = user.value.last_name;
      email.value = user.value.email;
    })
    .catch((error) => {
      console.log(error);
    });
}

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
    } else {
      updateUser();
    }
    form.classList.add("was-validated");
  });
};
// Update user data via API
const updateUser = async () => {
  // Update user email in Firebase Auth
  updateEmail(auth.currentUser, email.value)
    .then(() => {
    })
    .catch((error) => {
      console.log(error);
    });
  // Define form data object with user's details
  const formData = {
    first_name: firstName.value,
    last_name: lastName.value,
    email: email.value,
    address: address.value,
  };
  // Send a patch request via API to update user's details
  await axios
    .patch(
      "/api/v1/users/user/" + currentUserId.value,
      formData,
      {
        headers: {
          Authorization: `Bearer ${userStore.authToken}`,
        },
      }
    )
    .then((response) => {
      router.push("/items");
    })
    .catch((error) => {
      console.log(error);
    });
}

</script>
