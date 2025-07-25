import { createStore } from 'vuex'

export default createStore({
  state: {
    token: null,
    user: null
  },
  mutations: {
    setToken(state, token) {
      state.token = token
    },
    setUser(state, user) {
      state.user = user
    }
  },
  actions: {
    // Add login/logout actions here
  },
  modules: {
  }
})
