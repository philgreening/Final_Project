import { defineStore } from 'pinia'
import { onAuthStateChanged } from '@firebase/auth';
import { auth } from '../main.js';
import axios from 'axios';
import { useLocalStorage } from '@vueuse/core';


export const useUserStore = defineStore('userStore', {
  state: () =>  ({
    authToken: useLocalStorage('authToken', null),
    user: useLocalStorage('user', {
      id: null,
      name: null,
      first_name: '',
      last_name: '',
      // email: null,
      // address: null,
      admin: false,
    }
    )
}
),
actions:{
  init(){
    onAuthStateChanged(auth,(user)  => {
      
      if (user) {

        // User is signed in.
         user.getIdToken().then((idToken) => {
          this.authToken = idToken;
          this.user.id = user.uid;
       //   console.log("on app.vue: ", this.user.id)
          //this.getUser();


          axios.get('http://localhost:4000/User/' + this.user.id, {
                headers: {
                    Authorization: `Bearer ${this.authToken}`
                }
            })
                .then(response => {
                    // setTimeout(() =>{
                //    console.log("Get User res response: ", response.data)
                    // this.users = response.data;
                    this.user.first_name = response.data.first_name;
                    this.user.last_name = response.data.last_name;
                    this.user.admin = response.data.admin;
                    this.user.name = this.user.first_name + " " + this.user.last_name;
                  //  console.log("getUser store", this.user.name);
                // },500);
                })
                .catch(error => {
                    console.log(error);
                })
        }
        )
      } else {
        // No user is signed in.
        console.log("no user signed in")
        localStorage.clear();
      }
    })
  },
},


});

