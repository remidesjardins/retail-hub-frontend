<!--
 * RetailHub - InvoiceSearchView.vue
 *
 * Participants:
 * - Alexandre Borny
 * - Maël Castellan
 * - Laura Donato
 * - Rémi Desjardins
 *
 * This component provides an interface for searching and viewing invoices within RetailHub.
 * Users can search for invoices by client name or invoice reference and view the list of filtered invoices.
 * It includes navigation tabs to switch between client and invoice views.
 -->

<template>
  <div class="invoice-search">
    <!-- Navigation Bar -->
    <NavBar />

    <!-- Top Section containing tab buttons and search header -->
    <div class="top-section">
      <!-- Top Bar with Tab Buttons -->
      <div class="top-bar">
        <!-- Client Tab Button -->
        <button
            :class="{ active: activeTab === 'client' }"
            @click="switchTab('client')"
        >
          Client
        </button>

        <!-- Invoice Tab Button -->
        <button
            :class="{ active: activeTab === 'invoice' }"
            @click="switchTab('invoice')"
        >
          Invoice
        </button>
      </div>

      <!-- Header Component for Search Functionality -->
      <Header :searchQuery="searchQuery" @search="searchSales" id="header" />
    </div>

    <!-- Recent Sales Section displaying the list of invoices -->
    <div class="recent-sales">
      <!-- InvoiceList Component displaying filtered sales -->
      <InvoiceList :sales="filteredSales"></InvoiceList>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import InvoiceList from "@/components/InvoiceList.vue";
import NavBar from "@/components/NavBar.vue";

export default {
  components: {
    Header,
    InvoiceList,
    NavBar,
  },

  data() {
    return {
      /**
       * The current search query entered by the user.
       * Used to filter the list of invoices.
       * @type {string}
       */
      searchQuery: '',

      /**
       * The currently active tab ('client' or 'invoice').
       * Determines which view is active.
       * @type {string}
       */
      activeTab: 'invoice',

      /**
       * Array holding all fetched sales data from the backend.
       * @type {Array}
       */
      sales: [],

      /**
       * Array holding the filtered sales based on the search query.
       * @type {Array}
       */
      filteredSales: [],
    };
  },

  methods: {
    /**
     * Fetches all sales data from the backend API.
     * Processes each sale to include customer details and formats the reference.
     * Updates the sales and filteredSales arrays with the fetched data.
     *
     * @async
     */
    async fetchSales() {
      try {
        const response = await fetch('https://com.servhub.fr/api/sales');
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          // Process each sale to include customer details and formatted reference
          this.sales = await Promise.all(
              data.map(async sale => {
                const customer = await this.fetchCustomer(sale.customer_id);
                return {
                  _id: sale._id,
                  sale: sale,
                  customer: customer,
                  total_price: sale.total_price,
                  reference: `I-${sale._id.substring(0, 8)}`,
                };
              })
          );
          this.filteredSales = this.sales; // Initially, display all sales
        }
      } catch (error) {
        console.error('Error fetching sales:', error);
      }
    },

    /**
     * Filters the sales based on the provided search query.
     * The search matches against the client's name and the invoice reference.
     *
     * @param {string} query - The search query entered by the user.
     */
    searchSales(query) {
      const lowerQuery = query.toLowerCase();
      this.filteredSales = this.sales.filter(
          sale =>
              sale.customer.name.toLowerCase().includes(lowerQuery) ||
              sale.reference.toLowerCase().includes(lowerQuery)
      );
    },

    /**
     * Fetches customer details based on the provided customer ID from the backend API.
     *
     * @param {string} customer_id - The unique identifier of the customer.
     * @returns {Promise<Object|null>} - The customer data object or null if an error occurs.
     */
    async fetchCustomer(customer_id) {
      try {
        const response = await fetch(`https://com.servhub.fr/api/customers/${customer_id}`);
        const customerData = await response.json();
        return customerData;
      } catch (error) {
        console.error('Error fetching customer details:', error);
        return null;
      }
    },

    /**
     * Switches the active tab between 'client' and 'invoice'.
     * Navigates to the corresponding view based on the selected tab.
     *
     * @param {string} tab - The tab to switch to ('client' or 'invoice').
     */
    switchTab(tab) {
      this.activeTab = tab;
      if (tab === 'client') {
        this.$router.push({ name: 'ClientSearch' });
      }
    },
  },

  /**
   * Lifecycle hook called when the component is mounted.
   * Initiates fetching of sales data.
   */
  mounted() {
    this.fetchSales();
  },
};
</script>

<style scoped>
/* Container for toggle buttons and header */
.top-section {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: white;
  padding-bottom: .625rem;
  padding-right: .625rem;
}

/* Toggle buttons container */
.top-bar {
  display: flex;
  justify-content: center;
  padding: .625rem 0;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 14rem;
  position: relative;
  margin-left: 37vw;
  border-radius: 1.5rem;
}

.top-bar button {
  padding: .75rem 1.5rem;
  border: none;
  border-radius: 1.875rem;
  background-color: #f0f0f0;
  cursor: pointer;
  margin: 0 .625rem;
  font-size: 1rem;
  color: #333;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.top-bar button.active {
  background-color: #80cbc4;
}

/* Header inside top-section */
#header {
  padding: .625rem 0;
  background-color: white;
}

/* Scrollable Recent Sales Section */
.recent-sales {
  margin-top: .625rem;
  flex-grow: 1;
  overflow-y: auto;
  max-height: 75%; /* Adjust the height as needed */
  padding-right: 1.25rem; /* Add some padding for better scrollability */
}

.invoice-search {
  margin-left: 4.063rem;
  width: calc(100% - 4.063rem);
}

</style>