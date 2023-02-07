<template>
    <AdminTransactions />
    <AdminReservations />    
</template>

<script setup>
import AdminReservations from '../components/AdminReservations.vue';
import AdminTransactions from '../components/AdminTransactions.vue';
import { RouterLink, RouterView } from 'vue-router'

</script>
