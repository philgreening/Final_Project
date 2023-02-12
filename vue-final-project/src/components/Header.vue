<template>
    <nav class="navbar navbar-expand navbar-dark bg-dark p-4">
      <div class="container-fluid">
        <template v-if="!isLoggedIn">      
        <router-link to="/" class="navbar-brand"><strong>LibraryOfThings</strong></router-link>
      </template>
        <template v-else>
          <router-link to="/items" class="navbar-brand"><strong>LibraryOfThings</strong></router-link>
          </template>

        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navcollapse"
          aria-controls="navcollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
  
  
        <div class="collapse navbar-collapse" id="navcollapse">
          <!-- Display if user is authenticated -->
          <template v-if="isLoggedIn">
  
            <ul class="navbar-nav mr-auto">
              <li class="nav-item mx-2">
                <router-link to="/admin-transactions" class="nav-link"><strong>Admin Transactions</strong></router-link>
              </li>
              <li class="nav-item mx-2">
                <router-link to="/admin-reservations" class="nav-link"><strong>Admin Reservations</strong></router-link>
              </li>
              <li class="nav-item mx-2">
                <router-link to="/admin-items" class="nav-link"><strong>Admin Items</strong></router-link>
              </li>
              <!-- <li class="nav-item mx-2">
                <router-link to="/my-profile" class="nav-link"><strong>My Account</strong></router-link>
              </li>
              <li class="nav-item mx-2">
                <router-link to="/profile" class="nav-link"><strong>Edit Profile</strong></router-link>
              </li> -->
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
import axios from 'axios';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import router from '../router';
import { useUserStore } from '../stores/userStore';

const userStore = useUserStore();
const isLoggedIn = ref(false);
const auth = getAuth()

onMounted(() =>{
    onAuthStateChanged(auth, (user)=> {
        if (user) {
            isLoggedIn.value = true;
        }else{
            isLoggedIn.value = false;
        }
        })
    });

const handleSignOut = () => {
    signOut(auth).then(()=> {
      userStore.$reset();
        router.push("/");
    });
};

</script>
  