import { defineStore } from "pinia";
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "../main.js";
import axios from "axios";
import { useLocalStorage } from "@vueuse/core";

// Define the store and its initial state
export const useUserStore = defineStore("userStore", {
  state: () => ({
    authToken: useLocalStorage("authToken", null),
    user: useLocalStorage("user", { 
      id: null,
      name: null,
      first_name: "",
      last_name: "",
      admin: false,
    }),
  }),
  actions: {
    // Initialize the store with the user's authentication details
    init() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in. Get and store Auth token
          user.getIdToken().then((idToken) => {
            this.authToken = idToken;
            this.user.id = user.uid;

            // Get the user's details from the API
            axios
              .get("/api/v1/users/user/" + this.user.id, {
                headers: {
                  Authorization: `Bearer ${this.authToken}`,
                },
              })
              .then((response) => {
                // Store the user's details in the store
                this.user.first_name = response.data.first_name;
                this.user.last_name = response.data.last_name;
                this.user.admin = response.data.admin;
                this.user.name =
                  this.user.first_name + " " + this.user.last_name;
              })
              .catch((error) => {
                console.log(error);
              });
          });
        } else {
          // Clear local storage.
          localStorage.clear();
        }
      });
    },
  },
});
