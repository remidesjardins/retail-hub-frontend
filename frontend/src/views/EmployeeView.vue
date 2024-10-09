<!--
 * RetailHub - EmployeeView.vue
 *
 * Participants:
 * - Alexandre Borny
 * - Maël Castellan
 * - Laura Donato
 * - Rémi Desjardins
 *
 * This component provides an employee dashboard within RetailHub,
 * displaying the total sales and bonuses for the current month.
 * It also offers navigation to access detailed statistics and log out functionality.
 -->

<template>
  <div class="employee-dashboard">
    <!-- Navigation Bar -->
    <NavBar /> <!-- Assuming you have a NavBar component -->

    <!-- Dashboard Container holding statistics cards -->
    <div class="dashboard-container">
      <!-- Total Sold Statistics Card -->
      <div class="stats-card">
        <h2>Total sold in {{ monthInLetter(currentMonth) }} :</h2>
        <p class="value">{{ totalSold }} $</p>
      </div>

      <!-- Total Bonus Statistics Card -->
      <div class="stats-card">
        <h2>Total bonus in {{ monthInLetter(currentMonth) }} :</h2>
        <p class="value">{{ totalBonus }} $</p>
      </div>
    </div>

    <!-- Button Container for accessing stats and logging out -->
    <div class="button-container">
      <button @click="accessStats" class="stats-button">Access stats</button>
      <button @click="logOut" class="logout-button">Log out</button>
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
       * The unique identifier for the employee.
       * Note: This should ideally be dynamic, fetched from authentication data.
       */
      employeeId: "66fdffb56790cc1514a6a267", // Example employee ID, should be dynamic

      /**
       * Total amount sold by the employee in the current month.
       */
      totalSold: 0,

      /**
       * Total bonus earned by the employee in the current month.
       */
      totalBonus: 0,

      /**
       * The current month as a number (0 = January, 11 = December).
       */
      currentMonth: new Date().getMonth(), // Get current month (0 = January, 11 = December)
    };
  },

  methods: {
    /**
     * Fetches sales data from the backend API and calculates total sales and bonuses.
     */
    fetchSalesData() {
      const requestOptions = {
        method: "GET",
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
     * Calculates the total sales and bonuses for the employee based on fetched sales data.
     *
     * @param {Array} sales - Array of sales records fetched from the API.
     */
    calculateTotalSales(sales) {
      let total = 0;

      sales.forEach((sale) => {
        const saleDate = new Date(sale.sale_date);
        const saleMonth = saleDate.getMonth(); // Get the month of the sale

        // Check if the sale was made by this employee, is completed, and is in the current month
        if (
            sale.soldBy === this.employeeId &&
            sale.payment_status === "Completed" &&
            saleMonth === this.currentMonth
        ) {
          total += sale.total_price;
        }
      });

      this.totalSold = total.toFixed(2);
      this.totalBonus = (total * 0.01).toFixed(2); // Example bonus calculation (1% of total sales)
    },

    /**
     * Navigates the user to the statistics page.
     */
    accessStats() {
      this.$router.push({ name: "Admin" }); // Redirect to Admin (Statistics) page
    },

    /**
     * Handles the logout process for the employee.
     * Currently, it logs out to the console. Implement actual logout logic as needed.
     */
    logOut() {
      // Handle logout logic here (e.g., clearing tokens, redirecting to login)
      console.log("Logging out");
      // Example: this.$store.dispatch('logout').then(() => { this.$router.push('/login'); });
    },

    /**
     * Converts a month number to its corresponding month name in English.
     *
     * @param {number} monthId - The month number (0 = January, 11 = December).
     * @returns {string} - The full name of the month.
     */
    monthInLetter(monthId) {
      const date = new Date();
      date.setMonth(monthId);
      return date.toLocaleString('en-EN', { month: 'long' });
    },
  },

  /**
   * Lifecycle hook called when the component is mounted.
   * Initiates fetching of sales data.
   */
  mounted() {
    this.fetchSalesData();
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

.stats-button:hover,
.logout-button:hover {
  opacity: 0.9;
}
</style>