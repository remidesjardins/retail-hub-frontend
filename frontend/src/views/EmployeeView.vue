<template>
  <div class="employee-dashboard">
    <!-- Navigation Bar -->
    <NavBar />

    <!-- Dashboard Container holding statistics cards -->
    <div class="dashboard-container">
      <div class="stats-card">
        <h2>Total sold in {{ monthInLetter(currentMonth) }} :</h2>
        <p class="value">{{ totalSold }} $</p>
      </div>

      <div class="stats-card">
        <h2>Total bonus in {{ monthInLetter(currentMonth) }} :</h2>
        <p class="value">{{ totalBonus }} $</p>
      </div>
    </div>

    <!-- Button Container for accessing stats and logging out -->
    <div class="button-container">
      <button @click="accessStats" class="stats-button" v-if="isAdmin">Access stats</button>
      <button @click="logOut" class="logout-button">Log out</button>
    </div>

    <!-- Admin Panel for Creating New User (Visible Only to Admins) -->
    <div v-if="isAdmin" class="admin-panel">
      <h2>Admin Panel</h2>
      <h3>Create New User</h3>
      <form @submit.prevent="createAccount">
        <!-- Group Name and Email on the same line -->
        <div class="form-row">
          <div class="form-group">
            <label for="email">Email:</label>
            <input id="email" v-model="newUser.email" type="email" required />
          </div>
          <div class="form-group">
            <label for="name">Name:</label>
            <input id="name" v-model="newUser.name" type="text" required />
          </div>
        </div>
        <!-- Group Password and Role on the same line -->
        <div class="form-row">
          <div class="form-group">
            <label for="password">Password:</label>
            <input id="password" v-model="newUser.password" type="password" required />
          </div>
          <div class="form-group">
            <label for="role">Role:</label>
            <select id="role" v-model="newUser.role">
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
            </select>
          </div>
        </div>
        <button type="submit" class="create-user-btn">Create Account</button>
      </form>

      <!-- List of Users for Admin to Manage -->
      <h3>Manage Users</h3>
      <div class="user-management">
        <table class="user-table">
          <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <select v-model="user.role" @change="updateUserRole(user)">
                <option value="ADMIN">Admin</option>
                <option value="USER">User</option>
              </select>
            </td>
            <td>
              <button @click="deleteUser(user._id)" class="delete-btn">Delete</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";

export default {
  components: {
    NavBar,
  },

  data() {
    return {
      /**
       * Employee ID fetched from the store state
       * @type {String}
       */
      employeeId: this.$store.state.userId,

      /**
       * Total sales made by the employee
       * @type {Number}
       */
      totalSold: 0,

      /**
       * Total bonus earned by the employee
       * @type {Number}
       */
      totalBonus: 0,

      /**
       * Current month in numerical format
       * @type {Number}
       */
      currentMonth: new Date().getMonth(),

      /**
       * Object holding new user details
       * @type {Object}
       */
      newUser: {
        email: '',
        name: '',
        password: '',
        role: 'USER',
      },

      /**
       * Array to store list of all users
       * @type {Array}
       */
      users: []
    };
  },

  computed: {
    /**
     * Check if the current user has admin privileges
     * @returns {Boolean} true if the user is an admin, false otherwise
     */
    isAdmin() {
      return this.$store.state.userIsAdmin;
    },
  },

  methods: {
    /**
     * Fetch sales data for the current employee.
     * Makes a GET request to fetch sales information.
     */
    fetchSalesData() {
      const token = localStorage.getItem('authToken');
      const requestOptions = {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        redirect: "follow",
      };

      fetch("https://com.servhub.fr/api/sales/", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            this.calculateTotalSales(result);
          })
          .catch((error) => console.error("Error fetching sales data:", error));
    },

    /**
     * Calculate total sales and bonus from the fetched sales data.
     * @param {Array} sales - The list of sales data.
     */
    calculateTotalSales(sales) {
      let total = 0;

      sales.forEach((sale) => {
        const saleDate = new Date(sale.sale_date);
        const saleMonth = saleDate.getMonth();

        if (
            sale.soldBy === this.employeeId &&
            sale.payment_status === "Completed" &&
            saleMonth === this.currentMonth
        ) {
          total += sale.total_price;
        }
      });

      this.totalSold = total.toFixed(2);
      this.totalBonus = (total * 0.01).toFixed(2);
    },

    /**
     * Navigate to the Admin stats page.
     */
    accessStats() {
      this.$router.push({ name: "Admin" });
    },

    /**
     * Log out the current user by dispatching the logout action.
     */
    logOut() {
      this.$store.dispatch('logout');
    },

    /**
     * Convert numerical month to month name.
     * @param {Number} monthId - The numerical ID of the month (0 for January, 11 for December).
     * @returns {String} - The full name of the month.
     */
    monthInLetter(monthId) {
      const date = new Date();
      date.setMonth(monthId);
      return date.toLocaleString('en-EN', { month: 'long' });
    },

    /**
     * Create a new user account.
     * Makes a POST request to create a new user.
     */
    async createAccount() {
      try {
        const token = localStorage.getItem('authToken');
        const requestOptions = {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.newUser),
        };

        const response = await fetch('https://com.servhub.fr/api/users', requestOptions);
        const result = await response.json();

        if (response.ok) {
          alert(`User ${this.newUser.name} created successfully!`);
          this.newUser = { email: '', name: '', password: '', role: 'USER' }; // Reset the form
          this.fetchUsers(); // Refresh the user list after creation
        } else {
          alert(`Error creating user: ${result.message}`);
        }
      } catch (error) {
        console.error("Error creating account:", error);
        alert("An error occurred while creating the account.");
      }
    },

    /**
     * Fetch the list of all users.
     * Makes a GET request to retrieve all users from the API.
     */
    fetchUsers() {
      const token = localStorage.getItem('authToken');
      const requestOptions = {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      fetch("https://com.servhub.fr/api/users", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            this.users = result;
          })
          .catch((error) => console.error("Error fetching users:", error));
    },

    /**
     * Update the role of a user.
     * Makes a PUT request to update the user role.
     * @param {Object} user - The user object containing updated role information.
     */
    async updateUserRole(user) {
      const token = localStorage.getItem('authToken');
      const requestOptions = {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: user.role }),
      };

      try {
        const response = await fetch(`https://com.servhub.fr/api/users/${user._id}`, requestOptions);
        if (response.ok) {
          alert(`Role for ${user.name} updated successfully!`);
        } else {
          alert("Error updating role.");
        }
      } catch (error) {
        console.error("Error updating role:", error);
      }
    },

    /**
     * Delete a user from the system.
     * Makes a DELETE request to remove the user by ID.
     * @param {String} userId - The ID of the user to delete.
     */
    async deleteUser(userId) {
      const token = localStorage.getItem('authToken');
      const requestOptions = {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      try {
        const response = await fetch(`https://com.servhub.fr/api/users/${userId}`, requestOptions);
        if (response.ok) {
          alert("User deleted successfully!");
          this.fetchUsers(); // Refresh user list after deletion
        } else {
          alert("Error deleting user.");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    },
  },

  /**
   * Lifecycle hook that fetches the sales data and user list if the user is an admin.
   */
  mounted() {
    this.fetchSalesData();
    if (this.isAdmin) {
      this.fetchUsers(); // Fetch users if the user is an admin
    }
  },
};
</script>


<style scoped>
.employee-dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.25rem;
}

.dashboard-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 50rem;
  margin: 0 0 1.25rem 2rem;
}

.stats-card {
  background-color: #e0f7fa;
  border-radius: 1.5rem;
  padding: 1.25rem;
  text-align: center;
  flex: 1;
  margin: .625rem;
}

.value {
  color: green;
  font-size: 2.5rem;
  font-weight: bold;
  margin-top: 1rem;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 1.25rem;
}

.stats-button,
.logout-button {
  background-color: #80cbc4;
  border: none;
  border-radius: 1.5rem;
  padding: .625rem 1.25rem;
  font-size: 1rem;
  cursor: pointer;
  color: white;
}

.stats-button:hover {
  background-color: #5d8f8d;
}

.logout-button {
  background-color: #cb8087;
}

.logout-button:hover {
  background-color: #8f5d5f;
}

.admin-panel {
  margin-top: 2rem;
  padding: 1.25rem;
  border: 1px solid #ccc;
  border-radius: 1rem;
  max-width: 600px;
  width: 100%;
  background-color: #f9f9f9;
  overflow-x: auto;
}

.admin-panel h2 {
  margin-bottom: 1rem;
}
.admin-panel h3 {
  margin: 1rem;
  margin-left: 0;
  font-size: 1.25rem;
}

.form-row {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  flex: 1;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: .5rem;
}

.form-group input, .form-group select {
  width: 100%;
  padding: .75rem;
  border-radius: 1.5rem;
  border: 1px solid #ddd;
  font-size: 1rem;
}

.create-user-btn {
  background-color: #80cbc4;
  border: none;
  padding: .625rem 1.25rem;
  border-radius: 1rem;
  cursor: pointer;
  color: white;
  width: 100%;
  margin-top: 1rem;
}

.create-user-btn:hover {
  background-color: #5d8f8d;
}

.user-management {
  margin-top: 2rem;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table th, .user-table td {
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: left;
}

.user-table th {
  background-color: #f4f4f4;
}

.delete-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #d32f2f;
}

.admin-panel form div {
  margin-bottom: 1rem;
}

.admin-panel label {
  display: block;
  font-weight: bold;
  margin-bottom: .5rem;
}

.create-user-btn {
  background-color: #80cbc4;
  border: none;
  padding: .625rem 1.25rem;
  border-radius: 1rem;
  cursor: pointer;
  color: white;
}

.create-user-btn:hover {
  background-color: #5d8f8d;
}
.employee-dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f5f5f5;
}

.dashboard-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
  max-width: 50rem;
  margin-bottom: 2rem;
}

.stats-card {
  background-color: #ffffff;
  border-radius: 1.5rem;
  padding: 1.5rem;
  text-align: center;
  flex: 1;
  margin: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.stats-card h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.value {
  color: #4caf50;
  font-size: 2rem;
  font-weight: bold;
  margin-top: 1rem;
}

.button-container {
  display: flex;
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.stats-button,
.logout-button {
  background-color: #80cbc4;
  border: none;
  border-radius: 1.5rem;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  color: white;
  transition: background-color 0.3s ease;
}

.logout-button {
  background-color: #f44336;
}

.stats-button:hover{
  background-color: #139a8d;
}
.logout-button:hover{
  background-color: #a50f04;
}

/* Admin Panel Styles */
.admin-panel {
  width: 100%;
  max-width: 600px;
  background-color: white;
  border: 1px solid #ddd;
  padding: 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.admin-panel h2 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1.5rem;
}

.admin-panel .form-group {
  margin-bottom: 1.5rem;
}

.admin-panel label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: #333;
}

.admin-panel input,
.admin-panel select {
  width: 100%;
  padding: 0.75rem;
  border-radius: 1.5rem;
  border: 1px solid #ddd;
  font-size: 1rem;
}

select {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border-radius: 1.5rem;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  appearance: none;
  background-image: url('data:image/svg+xml;base64,...');
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

select:hover {
  border-color: #80cbc4;
}

select:focus {
  outline: none;
  border-color: #80cbc4;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.25);
}
.create-user-btn {
  background-color: #274156;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 1.5rem;
  cursor: pointer;
  color: white;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  display: block;
  margin-top: 1rem;
  width: 100%;
}

.create-user-btn:hover {
  background-color: #5d7180;
}

.user-management {
  margin-top: 2rem;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-table th, .user-table td {
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: left;
}
.user-table th{
  background-color: #274156;
  color: white;
}


.delete-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #d32f2f;
}
</style>