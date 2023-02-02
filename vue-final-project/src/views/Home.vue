<template>
  <!-- <div class="container-fluid">
    Home
    <button @click="handleSignOut" v-if="isLoggedIn">Sign out</button>
  </div> -->
  <div class="container-fluid" v-for="item in items" v-bind:key="item">
    <div class="card m-5" style="width: 18rem;">
  <img src="..." class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">{{ item.item_name }}</h5>
    <p class="card-text">{{ item.description }}</p>
    <p class="card-text">{{ item.status }}</p>
    <template v-if="item.status == 'Availiable'">
      <a href="#" class="btn btn-primary">Reserve</a>
    </template>
  </div>
</div>
  </div>

</template>

<script>
// import { onMounted, ref } from 'vue';
import axios from 'axios';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
// import router from '../router';

export default {
  name: 'Home',
  data() {
    return {
      items: []
    }
  },
  mounted() {
    const auth = getAuth();

     auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in.
     user.getIdToken().then((idToken) => {
      console.log(idToken)
      // Include the token as an Authorization header in your GET request:
      axios.get('http://localhost:4000/item/all', {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      })
      .then(response => {
        console.log(response.data)
        this.items = response.data;
      })
      .catch(error => {
        console.error(error)
      })
    })
  } else {
    // No user is signed in.
    console.log("no user signed in")
  }
})

  }

}


// const isLoggedIn = ref(false);
//  const auth = getAuth()

// onMounted(() =>{
//     onAuthStateChanged(auth, (user)=> {
//         if (user) {
//             isLoggedIn.value = true;
//         }else{
//             isLoggedIn.value = false;
//         }
//         })
//     });

// const handleSignOut = () => {
//     signOut(auth).then(()=> {
//         router.push("/");

//     });
// };

//   auth.onAuthStateChanged((user) => {
//   if (user) {
//     // User is signed in.
//      user.getIdToken().then((idToken) => {
//       console.log(idToken)
//       // Include the token as an Authorization header in your GET request:
//       axios.get('http://localhost:4000/item/all', {
//         headers: {
//           Authorization: `Bearer ${idToken}`
//         }
//       })
//       .then(response => {
//         console.log(response.data)
//         this.items = response.data;
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
//     data() {
//     return {
//       data: ""
//     };
//   }
 
//     auth.currentUser.getIdToken().then(token => {
//         console.log(token);
//      axios.get('http://localhost:4000/item/all', {
//         headers: {
//             'Authorization' : `Bearer ${token}`
//         }
//     })
//         .then(response => {
//           console.log(response)
//           this.data = response;
//         })
//         .catch(error => {
//           console.log(JSON.stringify(error))
//         })
//   })


// }
</script>