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
  mounted(){
    this.getAllItems();
  },
  methods:{
    async getAllItems() {
      await axios.get('http://localhost:4000/item/all', {
      })
      .then(response => {
        this.items = response.data;
        console.log(this.items);
      })
      .catch(error => {
        console.log(error)
      })
    },
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
  },
  computed: {
    randomItems() {
      return this.shuffleArray(this.items).slice(0, 3);
    }
  }
}
</script>