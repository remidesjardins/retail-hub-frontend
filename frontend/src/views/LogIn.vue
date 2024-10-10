<template>
  <div class="login-container">
    <div class="login-form">
      <h2>Log In to RetailHub</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email:</label>
          <input
              type="email"
              id="email"
              v-model="email"
              required
              placeholder="Enter your email"
          />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input
              type="password"
              id="password"
              v-model="password"
              required
              placeholder="Enter your password"
          />
        </div>
        <button type="submit" class="login-button">Log In</button>
      </form>
      <p class="signup-link">
        Don't have an account? <router-link to="/register">Sign Up</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async handleLogin() {
      try {
        await this.$store.dispatch('login', { email: this.email, password: this.password });
      } catch (error) {
        alert('Login failed. Please check your credentials.');
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 14px;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.login-button {
  width: 100%;
  padding: 10px;
  background-color: #42b983;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
}

.login-button:hover {
  background-color: #36a372;
}

.signup-link {
  margin-top: 15px;
  text-align: center;
}

.signup-link a {
  color: #42b983;
  font-weight: bold;
  text-decoration: none;
}

.signup-link a:hover {
  text-decoration: underline;
}
</style>