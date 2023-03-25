<template>
  <nav class="navbar navbar-expand navbar-dark navbar-custom p-4">
    <div class="container-fluid">
      <!-- Display if user is NOT authenticated -->
      <template v-if="!isLoggedIn">

        <router-link to="/" class="navbar-brand"><img src="../assets/Library of things-logos-cropped.jpeg"
            class="img-fluid"></router-link>
        <!-- <router-link to="/" class="navbar-brand"><strong>LibraryOfThings</strong></router-link> -->

      </template>
      <!-- Display if user is authenticated -->
      <template v-else>
        <!-- <router-link to="/items" class="navbar-brand"><strong>LibraryOfThings</strong></router-link> -->
        <router-link to="/" class="navbar-brand"><img src="../assets/Library of things-logos-cropped.jpeg"
            class="img-fluid"></router-link>

      </template>
      <!-- Hamburger button for mobile view -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navigation menu -->
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <!-- Display if user is authenticated -->
        <template v-if="isLoggedIn">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item mx-2">
              <router-link to="/items" class="nav-link navbar-text">Home</router-link>
            </li>
            <!-- Display dropdown if user is an admin -->
            <template v-if="isAdmin">
              <li class="nav-item dropdown mx-2">
                <router-link to="#" class="nav-link navbar-text dropdown-toggle" role="button" data-bs-toggle="dropdown"
                  aria-expanded="false">
                  Admin
                </router-link>
                <ul class="dropdown-menu">
                  <li>
                    <router-link to="/admin-items" class="dropdown-item">Items</router-link>
                  </li>
                  <li>
                    <router-link to="/admin-users" class="dropdown-item">Users</router-link>
                  </li>
                  <li>
                    <hr class="dropdown-divider" />
                  </li>
                  <li>
                    <router-link to="/admin-transactions" class="dropdown-item">Transactions</router-link>
                  </li>
                  <li>
                    <router-link to="/admin-reservations" class="dropdown-item">Reservations</router-link>
                  </li>
                </ul>
              </li>
            </template>
            <!-- User dropdown menu -->
            <li class="nav-item dropdown mx-2">
              <router-link to="#" class="nav-link navbar-text dropdown-toggle" role="button" data-bs-toggle="dropdown"
                aria-expanded="false" v-model="username">
                {{ username }}
              </router-link>
              <ul class="dropdown-menu">
                <li>
                  <router-link to="/user-details" class="dropdown-item">My Details</router-link>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>
                <li>
                  <router-link to="/user-reservations" class="dropdown-item">My Reservations</router-link>
                </li>
                <li>
                  <router-link to="/user-currentLoans" class="dropdown-item">My Current Loans</router-link>
                </li>
                <li>
                  <router-link to="/user-transactions" class="dropdown-item">My Transactions</router-link>
                </li>
              </ul>
            </li>
          </ul>
        </template>
      </div>
      <!-- Display if user is NOT authenticated -->
      <template v-if="!isLoggedIn">
        <div class="navbar-end">
          <!-- <router-link to="/register" class="btn btn-light me-4"><strong>Register</strong></router-link> -->
          <router-link to="/login" class="btn me-4 navbar-button"><strong>Sign in </strong>
            <font-awesome-icon icon="arrow-right-to-bracket" size="xl" />
          </router-link>
        </div>
      </template>
      <template v-else>
        <div class="navbar-end">
          <!-- / <form @submit.prevent="logout"> -->
          <button type="submit" class="btn me-4 navbar-button" @click="handleSignOut" v-if="isLoggedIn">
            <strong>Sign out </strong>
            <font-awesome-icon icon="arrow-right-to-bracket" size="xl" />
          </button>
        </div>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { useUserStore } from "../stores/userStore";
import { onMounted, ref } from "vue";
import { onAuthStateChanged, signOut } from "firebase/auth";
import router from "../router";
import { auth } from "../main.js";

const userStore = useUserStore();
const isLoggedIn = ref(false);
const username = ref();
const isAdmin = ref(false);

isAdmin.value = userStore.user.admin;

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;

      // Sets username on user account dropdown
      setTimeout(() => {
        username.value = userStore.user.name;
        isAdmin.value = userStore.user.admin;
      }, 500);
    } else {
      isLoggedIn.value = false;
      username.value = null;
    }
  });
});

const handleSignOut = () => {
  signOut(auth).then(() => {
    userStore.$reset();
    localStorage.clear();
    router.push("/");
  });
};
</script>

<style>
.navbar-custom {
  background-color: #539D8B;
}
.navbar-text {
  color: #F5C5BE;
}
.navbar-button {
  background-color: #F5C5BE;
}
</style>