import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/items',
      name:'items',
      component: () => import('../views/Items.vue')
    },
    {
      path: '/admin-transactions',
      name: 'admin-transactions',
      component: () => import('../views/AdminTransactions.vue')
    },
    {
      path: '/admin-reservations',
      name: 'admin-reservations',
      component: () => import('../views/AdminReservations.vue')
    },
    {
      path: '/admin-items',
      name: 'admin-items',
      component: () => import('../views/AdminItems.vue')
    },
    {
      path: '/admin-users',
      name: 'admin-users',
      component: () => import('../views/AdminUsers.vue')
    },
    {
      path: '/user-reservations',
      name: 'user-reservations',
      component: () => import('../views/UserReservations.vue')
    },
    {
      path: '/user-transactions',
      name: 'user-transactions',
      component: () => import('../views/UserTransactions.vue')
    },
    {
      path: '/user-currentLoans',
      name: 'user-currentLoans',
      component: () => import('../views/UserCurrentLoans.vue')
    },
    {
      path: '/user-details',
      name: 'user-details',
      component: () => import('../views/UserDetails.vue')
    },
    {
      path: '/register-google',
      name: 'register-google',
      component: () => import('../views/RegisterGoogle.vue')
    },


  ]
})

export default router
