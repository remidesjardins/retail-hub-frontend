<!--
 * RetailHub - SaleStockView.vue
 *
 * Participants:
 * - Alexandre Borny
 * - Maël Castellan
 * - Laura Donato
 * - Rémi Desjardins
 *
 * This component manages the sale and stock view within RetailHub.
 * It allows users to search for products, view recent products, and access
 * detailed information about selected products. It integrates with other
 * components like NavBar, Header, ProductList, ProductDetails, and CommandBoxes.
 -->

<template>
  <div class="home-container">
    <!-- Navigation Bar -->
    <NavBar class="navbar"></NavBar>

    <div class="content">
      <!-- Header with search functionality -->
      <Header :searchQuery="searchQuery" @search="handleSearch" id="Header"/>

      <!-- Product List Display -->
      <ProductList
          :productList="filteredProducts"
          :text="'Recent Products'" id="product-list-text"
          :isEmpty="isEmpty"
          @productSelected="showProductDetailsOverlay"
      />

      <!-- Product Details Overlay -->
      <ProductDetails
          v-if="showProductDetails"
          :product="selectedProduct"
          @close="closeProductDetailsOverlay"
      />

      <!-- Command Boxes for additional commands -->
      <CommandBoxes></CommandBoxes>
    </div>
  </div>
</template>

<script>
// Import required components
import Header from "@/components/Header.vue";
import ProductList from '@/components/ProductList.vue';
import NavBar from "@/components/NavBar.vue";
import CommandBoxes from "@/components/CommandBoxes.vue";
import ProductDetails from "@/components/ProductDetails.vue";

export default {
  components: {
    CommandBoxes,
    ProductList,
    NavBar,
    ProductDetails,
    Header,
  },

  data() {
    return {
      /**
       * The current search query entered by the user.
       * Used to filter the list of products.
       * @type {string}
       */
      searchQuery: "",

      /**
       * Array holding all fetched products from the backend.
       * @type {Array}
       */
      products: [],  // Reactive array to store products

      /**
       * The currently selected product to display in the ProductDetails overlay.
       * @type {Object|null}
       */
      selectedProduct: null, // Store the selected product

      /**
       * Flag to control the visibility of the ProductDetails overlay.
       * @type {boolean}
       */
      showProductDetails: false, // Toggle for product details overlay

      /**
       * Flag indicating whether the product list is empty.
       * @type {boolean}
       */
      isEmpty: false,
    };
  },

  computed: {
    /**
     * Filters the list of products based on the search query.
     * If the search query is empty, returns all products.
     *
     * @returns {Array} - Array of products matching the search criteria.
     */
    filteredProducts() {
      if (this.searchQuery.trim() === "") {
        return this.products; // If no search query, return all products
      }
      return this.products.filter(product => {
        return product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            product.SKU.toString().includes(this.searchQuery.toLowerCase());
      });
    },

    /**
     * Determines the title to display based on the search query.
     * If there is no search query, displays "Recent search", else "Search Result".
     *
     * @returns {string} - The title to display.
     */
    searchTitle() {
      return this.searchQuery.trim() === "" ? "Recent search" : "Search Result";
    },
  },

  created() {
    // Fetch products initially when the component is created
    this.fetchInitialProducts();
  },

  methods: {
    /**
     * Fetches the initial list of products from the backend API.
     * Updates the products array with the fetched data.
     */
    fetchInitialProducts() {
      fetch('https://com.servhub.fr/api/products')
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            this.updateProducts(data);
          })
          .catch(error => {
            console.error('Error fetching products:', error.message);
          });
    },

    /**
     * Updates the products array with the fetched product list.
     * Also updates the isEmpty flag based on whether the product list is empty.
     *
     * @param {Array} productList - The list of products fetched from the API.
     */
    updateProducts(productList) {
      this.products = productList;
      this.isEmpty = productList.length === 0;
    },

    /**
     * Shows the ProductDetails overlay for the selected product.
     *
     * @param {Object} product - The product selected by the user.
     */
    showProductDetailsOverlay(product) {
      this.selectedProduct = product; // Set the selected product
      this.showProductDetails = true; // Show the overlay
    },

    /**
     * Closes the ProductDetails overlay.
     */
    closeProductDetailsOverlay() {
      this.showProductDetails = false; // Close the overlay
    },

    /**
     * Handles the search functionality by updating the searchQuery.
     *
     * @param {string} query - The search query entered by the user.
     */
    handleSearch(query) {
      this.searchQuery = query;
    },
  },

  mounted() {
    // Set up polling to fetch products every 5 seconds
    this.polling = setInterval(() => {
      this.fetchInitialProducts();
    }, 5000);
  },
};
</script>

<style scoped>

#product-list-text {
  margin: 1rem 0;
}

.home-container {
  margin-left: 3.75rem;
  max-width: 100vw;
  flex-wrap: nowrap;
  overflow-x: auto;
  flex-direction: row;
  height: 100vh;
}

.content {
  margin-left: 1.25rem;
  flex-grow: 1;
  padding: 1.25rem;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1.25rem;
  height: 100%; /* Ensure the content takes full height */
}

</style>s