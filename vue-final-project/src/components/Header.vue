<template>
    <nav class="navbar navbar-expand navbar-dark bg-dark p-4">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand"><strong>LibraryOfThings</strong></router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navcollapse"
          aria-controls="navcollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
  
  
        <div class="collapse navbar-collapse" id="navcollapse">
          <!-- Display if user is authenticated -->
          <template v-if="isLoggedIn">
  
            <ul class="navbar-nav mr-auto">
              <!-- <li class="nav-item mx-2"> -->
                <!-- <router-link to="/feed" class="nav-link"><strong>My Feed</strong></router-link>
              </li>
              <li class="nav-item mx-2">
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
            <router-link to="/login" class="btn btn-light me-4"><strong>Log In</strong></router-link>
          </div>
        </template>
        <template v-else>
  
          <div class="navbar-end ">
           <!-- / <form @submit.prevent="logout"> -->
              <button @click="handleSignOut" v-if="isLoggedIn">Sign out</button>
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
        router.push("/");
    });
};

//  auth.onAuthStateChanged((user) => {
//   if (user) {
//     // User is signed in.
//     user.getIdToken().then((idToken) => {
//         console.log(idToken)
//       // Include the token as an Authorization header in your GET request:
//       axios.get('http://localhost:4000/item/all', {
//         headers: {
//           Authorization: `Bearer ${idToken}`
//         }
//       })
//       .then(response => {
//         console.log(response.data)
//       })
//       .catch(error => {
//         console.error(error)
//       })
//     })
//   } else {
//     // No user is signed in.
//     console.log("no user signed in")
//   }
// })



// export default {
//   name: 'Header',
//   methods: {
//     async logout() {
//       // call logout api end point and send token
//       await axios
//         .post('api/v1/token/logout/')
//         .then(response => {
//           console.log('logged out')
//         })
//         .catch(error => {
//           console.log(JSON.stringify(error))
//         })
//       // remove authentication token and data
//       axios.defaults.headers.common["Authorization"] = "";
//       localStorage.removeItem("token");
//       localStorage.removeItem('username');
//       localStorage.removeItem('userid');
//       this.$store.commit('removeToken');
//       this.$store.state.user.username = '';
//       this.$router.push('/');
//     },
//   },
// }
</script>
  