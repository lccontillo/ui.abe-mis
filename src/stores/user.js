// src/stores/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
  }),
  actions: {
    async fetchMe() {
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        const res = await fetch('https://api-abealcala.duckdns.org/me', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        const data = await res.json()
        if (data.code === 200) {
          this.user = data.user
        }
      } catch (err) {
        console.error('Failed to fetch user:', err)
      }
    },
    clearUser() {
      this.user = null
    },
  },
})
