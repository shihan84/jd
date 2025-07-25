<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div>
        <label for="username">Username</label>
        <input type="text" id="username" v-model="username" required>
      </div>
      <div>
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <p v-if="error" style="color: red;">{{ error }}</p>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      error: null
    };
  },
  methods: {
    async login() {
      this.error = null;
      try {
        // FastAPI's OAuth2PasswordRequestForm expects form data
        const params = new URLSearchParams();
        params.append('username', this.username);
        params.append('password', this.password);

        const response = await axios.post('/api/auth/token', params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        const token = response.data.access_token;
        this.$store.commit('setToken', token);
        
        // Set default auth header for all subsequent axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Decode token to check user role
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.$store.commit('setUser', { username: payload.sub, isAdmin: payload.is_admin });

        if (payload.is_admin) {
          this.$router.push('/admin/servers');
        } else {
          // This will be the client dashboard later
          console.log('Client user logged in, redirect pending implementation.');
        }

      } catch (err) {
        if (err.response && err.response.data && err.response.data.detail) {
            this.error = err.response.data.detail;
        } else {
            this.error = 'An unexpected error occurred.';
        }
        console.error("Login failed:", err);
      }
    }
  }
};
</script>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}
form {
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
div {
  margin-bottom: 15px;
}
label {
  margin-bottom: 5px;
  display: block;
}
input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style>
