<template>
    <AdminTransactions @update="componentkey = 1" :key="componentkey"/>
    <AdminReservations  />    
</template>

<script setup>
import AdminReservations from '../components/AdminReservations.vue';
import AdminTransactions from '../components/AdminTransactions.vue';
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router'

const componentkey = ref('0');
console.log(componentkey);


</script>
