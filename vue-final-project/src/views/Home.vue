<template>
  <div class="container p-4">
    <div class="row">
      <div class="col-md-4" v-for="item in randomItems" v-bind:key="item">
        <div class="card m-4 shadow">
          <img v-bind:src="item.imageUrl" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">{{ item.item_name }}</h5>
            <p class="card-text">{{ item.description }}</p>
          </div>
        </div>
      </div>
      <div class="row p-4 justify-content-center text-center">
        <router-link to="/register" class="btn me-4 button col-5">
          <h1>Sign Up </h1>
        </router-link>
        <router-link to="/login" class="btn me-4 button col-5">
          <h1>Sign in </h1>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Home',
  data() {
    return {
      items: []
    }
  },
  mounted() {
    this.getAllItems();
  },
  methods: {
    // Gets all items from server via API  
    async getAllItems() {
      await axios.get('/api/v1/items', {
      })
        .then(response => {
          this.items = response.data;
        })
        .catch(error => {
          console.log(error)
        })
    },
    // Creates random array of items
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
  },
  computed: {
    // Returns 3 randon items to display
    randomItems() {
      return this.shuffleArray(this.items).slice(0, 3);
    }
  }
}
</script>

<style>
.button {
  background-color: #539D8B;
  color: #F5C5BE;
}</style>