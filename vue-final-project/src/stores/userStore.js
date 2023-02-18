import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    authToken: null,
    user: {
      id: null,
      isAdmin: false
    }
  })
});
