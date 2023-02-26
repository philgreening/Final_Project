<template>
    <div>
      <Header></Header>
      <RouterView />
  </div>
</template>

<script setup>
  import { RouterView } from 'vue-router'
  import Header from './components/Header.vue'
  // import { getAuth, onAuthStateChanged } from '@firebase/auth';
  import { useUserStore } from './stores/userStore';
  import { onMounted } from 'vue';  

  // const auth = getAuth()
  const userStore = useUserStore();
  let currentUserId = userStore.user.first_name;

  onMounted(()=>{
    userStore.init();
    // console.log("app.vue init",currentUserId)
    
  })

//   onAuthStateChanged(auth,(user) => {
//   if (user) {
//     // User is signed in.
//      user.getIdToken().then((idToken) => {
//       userStore.authToken = idToken;
//       userStore.user.id = user.uid;
//       console.log("on app.vue: ", currentUserId)
//       // getUser();
//     })
//   } else {
//     // No user is signed in.
//     console.log("no user signed in")
//   }
// })

//   const getUser = async() => {
//     console.log(currentUserId);
//     await axios.get('http://localhost:4000/User/' + currentUserId, {
//                 headers: {
//                     Authorization: `Bearer ${userStore.authToken}`
//                 }
//             })
//                 .then(response => {
//                     console.log("Get User res response: ", response.data)
//                     // this.users = response.data;
//                     userStore.user.first_name = response.data.first_name;
//                     userStore.user.last_name = response.data.last_name;
//                     userStore.user.admin = response.data.admin;
//                     console.log("getUser store", userStore.user);
//                 })
//                 .catch(error => {
//                     console.log(error);
//                 })

//  }


  
//  async getAllUsers() {
//             await axios.get('http://localhost:4000/User/all', {
//                 headers: {
//                     Authorization: `Bearer ${userStore.authToken}`
//                 }
//             })
//                 .then(response => {
//                     console.log("res response: ", response.data)
//                     this.users = response.data;
//                 })
//                 .catch(error => {
//                     console.log(error);
//                 })
//         },



</script>

<style scoped>
/* header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
} */
</style>
