<template>
  <div class="container-fluid" v-for="(item, index) in items" :key="item.item_id">
    <div class="card m-5" style="width: 18rem;">
  <img src="..." class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">{{ item.item_name }}</h5>
    <p class="card-text">{{ item.description }}</p>
    <p class="card-text">{{ item.status }}</p>
    <template v-if="item.status == 'On Loan'">
    <template v-for="transaction in transactions" :key="transaction.transaction_id">
    <template v-if="item.item_id === transaction.item_id">
    <p class="card-text"> Due date: {{ formatDate(transaction.due_date) }}</p>
    </template>

    </template>
    </template>
    <template v-if="item.status == 'Availiable'">
      <button type="button" v-bind="index"  @click="reserveItem(index)" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Reserve</button>
    </template>
  </div>
</div>
  </div>

  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <h1>Do you wish to reserve this item? </h1>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
        <!-- <button type="button" class="btn btn-primary">Save changes</button> -->
        <button type="button"  class="btn btn-primary" @click="reserveItem(index)" data-bs-dismiss="modal">Yes </button>
      </div>
    </div>
  </div>
</div>

</template>

<script>
// import { onMounted, ref } from 'vue';
import axios from 'axios';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useUserStore } from '../stores/userStore';
import dayjs from 'dayjs';

// import router from '../router';
const userStore = useUserStore();

export default {
  name: 'Home',
  data() {
    return {
      items: [],
      reservations: [],
      transactions: [],
      reservedItemId: null,
      // uid: null,
      // idTok: null
    }
  },
   async mounted() {

     await axios.get('http://localhost:4000/item/all', {
        headers: {
          Authorization: `Bearer ${userStore.authToken}`
        }
      })
      .then(response => {
        console.log(response.data)
        this.items = response.data;
      })
      .catch(error => {
        console.log(error)
      })

      await axios.get('http://localhost:4000/Reservation/all', {
    headers: {
          Authorization: `Bearer ${userStore.authToken}`
        }
  })
          .then(response =>{
            console.log("res response: ",response.data)
            this.reservations = response.data;
          })
          .catch(error => {
            console.log(error);
          })
        
        await axios.get('http://localhost:4000/Transaction/all', {
    headers: {
          Authorization: `Bearer ${userStore.authToken}`
        }
  })
          .then(response =>{
            console.log("res response: ",response.data)
            this.transactions = response.data;
          })
          .catch(error => {
            console.log(error);
          })
  },
  methods: {
   async reserveItem(item) {
    console.log(item);

      for(let i=0; i < this.items.length; i++){

      }
    },
    formatDate(timestamp){
      console.log(timestamp)
      let date = new Date(timestamp._seconds * 1000)
      date = date.toDateString();
      return date;
    }


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