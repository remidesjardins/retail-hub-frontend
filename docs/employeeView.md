---
title: EmployeeView
---
# Introduction

This document will walk you through the implementation of the <SwmToken path="/frontend/src/views/EmployeeView.vue" pos="2:7:7" line-data=" * RetailHub - EmployeeView.vue">`EmployeeView`</SwmToken> feature.

The feature provides an employee dashboard within <SwmToken path="/frontend/src/views/EmployeeView.vue" pos="2:3:3" line-data=" * RetailHub - EmployeeView.vue">`RetailHub`</SwmToken>, displaying the total sales and bonuses for the current month. It also offers navigation to access detailed statistics and log out functionality.

We will cover:

1. The structure of the <SwmToken path="/frontend/src/views/EmployeeView.vue" pos="2:7:7" line-data=" * RetailHub - EmployeeView.vue">`EmployeeView`</SwmToken> component.
2. Data properties and their initialization.
3. Methods for fetching and calculating sales data.
4. Navigation and logout functionality.

# Component structure

<SwmSnippet path="/frontend/src/views/EmployeeView.vue" line="15">

---

The <SwmToken path="/frontend/src/views/EmployeeView.vue" pos="2:7:7" line-data=" * RetailHub - EmployeeView.vue">`EmployeeView`</SwmToken> component is defined in <SwmPath>[frontend/src/views/EmployeeView.vue](/frontend/src/views/EmployeeView.vue)</SwmPath>. It includes a navigation bar, statistics cards for total sales and bonuses, and buttons for accessing stats and logging out.

```
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
```

---

</SwmSnippet>

# Component registration

<SwmSnippet path="/frontend/src/views/EmployeeView.vue" line="47">

---

The <SwmToken path="/frontend/src/views/EmployeeView.vue" pos="48:1:1" line-data="    NavBar,">`NavBar`</SwmToken> component is registered locally within <SwmToken path="/frontend/src/views/EmployeeView.vue" pos="2:7:7" line-data=" * RetailHub - EmployeeView.vue">`EmployeeView`</SwmToken>.

```
  components: {
    NavBar,
  },
```

---

</SwmSnippet>

# Data properties

<SwmSnippet path="/frontend/src/views/EmployeeView.vue" line="51">

---

The component initializes several data properties, including <SwmToken path="/frontend/src/views/EmployeeView.vue" pos="57:1:1" line-data="      employeeId: &quot;66fdffb56790cc1514a6a267&quot;, // Example employee ID, should be dynamic">`employeeId`</SwmToken>, <SwmToken path="/frontend/src/views/EmployeeView.vue" pos="62:1:1" line-data="      totalSold: 0,">`totalSold`</SwmToken>, <SwmToken path="/frontend/src/views/EmployeeView.vue" pos="67:1:1" line-data="      totalBonus: 0,">`totalBonus`</SwmToken>, and <SwmToken path="/frontend/src/views/EmployeeView.vue" pos="72:1:1" line-data="      currentMonth: new Date().getMonth(), // Get current month (0 = January, 11 = December)">`currentMonth`</SwmToken>.

```
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
```

---

</SwmSnippet>

# Fetching sales data

<SwmSnippet path="/frontend/src/views/EmployeeView.vue" line="77">

---

The <SwmToken path="/frontend/src/views/EmployeeView.vue" pos="80:1:1" line-data="    fetchSalesData() {">`fetchSalesData`</SwmToken> method fetches sales data from the backend API and calculates total sales and bonuses.

```
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
```

---

</SwmSnippet>

# Calculating total sales and bonuses

<SwmSnippet path="/frontend/src/views/EmployeeView.vue" line="94">

---

The <SwmToken path="/frontend/src/views/EmployeeView.vue" pos="99:1:1" line-data="    calculateTotalSales(sales) {">`calculateTotalSales`</SwmToken> method processes the fetched sales data to compute the total sales and bonuses for the current month.

@param {Array} <SwmToken path="/frontend/src/views/EmployeeView.vue" pos="99:3:3" line-data="    calculateTotalSales(sales) {">`sales`</SwmToken> - Array of sales records fetched from the API.

```
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
```

---

</SwmSnippet>

# Navigation and logout

<SwmSnippet path="/frontend/src/views/EmployeeView.vue" line="120">

---

The <SwmToken path="/frontend/src/views/EmployeeView.vue" pos="123:1:1" line-data="    accessStats() {">`accessStats`</SwmToken> method navigates the user to the statistics page, while the <SwmToken path="/frontend/src/views/EmployeeView.vue" pos="38:8:8" line-data="      &lt;button @click=&quot;logOut&quot; class=&quot;logout-button&quot;&gt;Log out&lt;/button&gt;">`logOut`</SwmToken> method handles the logout process.

```
    /**
     * Navigates the user to the statistics page.
     */
    accessStats() {
      this.$router.push({ name: "Admin" }); // Redirect to Admin (Statistics) page
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/EmployeeView.vue" line="127">

---

```
    /**
     * Handles the logout process for the employee.
     * Currently, it logs out to the console. Implement actual logout logic as needed.
     */
    logOut() {
      // Handle logout logic here (e.g., clearing tokens, redirecting to login)
      console.log("Logging out");
      // Example: this.$store.dispatch('logout').then(() => { this.$router.push('/login'); });
    },
```

---

</SwmSnippet>

# Utility method

<SwmSnippet path="/frontend/src/views/EmployeeView.vue" line="137">

---

The <SwmToken path="/frontend/src/views/EmployeeView.vue" pos="143:1:1" line-data="    monthInLetter(monthId) {">`monthInLetter`</SwmToken> method converts a month number to its corresponding month name in English.

@param {number} <SwmToken path="/frontend/src/views/EmployeeView.vue" pos="143:3:3" line-data="    monthInLetter(monthId) {">`monthId`</SwmToken> - The month number (0 = January, 11 = December).\
@returns {string} - The full name of the month.

```
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
```

---

</SwmSnippet>

# Lifecycle hook

<SwmSnippet path="/frontend/src/views/EmployeeView.vue" line="150">

---

The <SwmToken path="/frontend/src/views/EmployeeView.vue" pos="151:17:17" line-data="   * Lifecycle hook called when the component is mounted.">`mounted`</SwmToken> lifecycle hook initiates the fetching of sales data when the component is mounted.

```
  /**
   * Lifecycle hook called when the component is mounted.
   * Initiates fetching of sales data.
   */
  mounted() {
    this.fetchSalesData();
  },
```

---

</SwmSnippet>

This concludes the walkthrough of the <SwmToken path="/frontend/src/views/EmployeeView.vue" pos="2:7:7" line-data=" * RetailHub - EmployeeView.vue">`EmployeeView`</SwmToken> feature. The component is designed to provide employees with a clear overview of their sales performance and easy access to additional statistics and logout functionality.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBUmV0YWlsSFVCLUZyb250ZW5kJTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="RetailHUB-Frontend"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
