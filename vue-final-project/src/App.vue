<template>
    <div>
      <Header></Header>
      <RouterView />
  </div>
</template>

<script setup>
  import { useUserStore } from './stores/userStore';
  import { onMounted } from 'vue';  
  import { RouterView } from 'vue-router'
  import Header from './components/Header.vue'

  const userStore = useUserStore();
  
  onMounted(()=>{
    userStore.init();
  })
  
</script>

<style scoped>
</style>
