<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark p-4">
    <div class="container-fluid">
      <template v-if="!isLoggedIn">
        <router-link to="/" class="navbar-brand"><strong>LibraryOfThings</strong></router-link>
      </template>
      <template v-else>
        <router-link to="/items" class="navbar-brand"><strong>LibraryOfThings</strong></router-link>
      </template>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>


      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <!-- Display if user is authenticated -->
        <template v-if="isLoggedIn">

          <ul class="navbar-nav mr-auto">
            <li class="nav-item mx-2">
              <router-link to="/items" class="nav-link">Home</router-link>
            </li>
            <li class="nav-item dropdown mx-2">

              <router-link to="#" class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown"
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
                  <hr class="dropdown-divider">
                </li>
                <li>
                  <router-link to="/admin-transactions" class="dropdown-item">Transactions</router-link>
                </li>
                <li>
                  <router-link to="/admin-reservations" class="dropdown-item">Reservations</router-link>
                </li>

              </ul>
            </li>
            <li class="nav-item dropdown mx-2">

              <router-link to="#" class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown"
                aria-expanded="false" v-model="username"> {{ username }}
              </router-link>
              <ul class="dropdown-menu">
                <li>
                  <router-link to="/user-details" class="dropdown-item">My Details</router-link>
                </li>
                <li>
                  <hr class="dropdown-divider">
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

          <form action="/search" method="get" id="search-form">
            <div class="input-group mx-5">
              <input type="text" class="form-control" name="q" placeholder="Search" required>
              <div class="input-group-append">
                <button class="btn btn-success" type="submit" form="search-form">Search</button>
              </div>
            </div>
          </form>
        </template>
      </div>
      <!-- Display if user is NOT authenticated -->
      <template v-if="!isLoggedIn">
        <div class="navbar-end ">
          <router-link to="/register" class="btn btn-light me-4"><strong>Register</strong></router-link>
          <router-link to="/login" class="btn btn-light me-4"><strong>Log In</strong></router-link>
        </div>
      </template>
      <template v-else>

        <div class="navbar-end ">
          <!-- / <form @submit.prevent="logout"> -->
          <button type="submit" class="btn btn-danger me-4" @click="handleSignOut" v-if="isLoggedIn">Sign out</button>
          <!-- <button type="submit" class="btn btn-danger me-4"><strong>Log Out</strong></button> -->
          <!-- </form> -->
        </div>
      </template>
    </div>
  </nav>
</template>


<script setup>
import { onMounted, ref } from 'vue';
import {  onAuthStateChanged, signOut } from "firebase/auth";
import router from '../router';
import { auth }from '../main.js';
import { useUserStore } from '../stores/userStore';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const isLoggedIn = ref(false);
const username = ref()




onMounted(() => {
  
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
     // console.log("header dropdown: ", username)

      // Sets username on user account dropdown
      setTimeout(() =>{
      username.value = userStore.user.name
    //  console.log("username",username.value);
 }, 500)
    } else {
      isLoggedIn.value = false;
      username.value = null;
    }
  })
});



const handleSignOut = () => {
  //console.log("username",username);
  signOut(auth).then(() => {
    console.log('logoutussername',username)
    userStore.$reset();
    localStorage.clear();
    console.log("on logout:",userStore.user)
    router.push("/");
  });
};

</script>
  