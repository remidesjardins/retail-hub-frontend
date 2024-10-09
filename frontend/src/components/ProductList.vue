<!--
  =====================================================
  Project: RetailHub
  File: ProductList.vue
  Description: Component for displaying a list of products with slider functionality, allowing users to select products or view detailed information.
  Participants:
    - Alexandre Borny
    - Maël Castellan
    - Laura Donato
    - Rémi Desjardins
  =====================================================
-->

<template>
  <!-- Main container for the Product List -->
  <div>
    <!-- Header displaying dynamic text -->
    <h2>{{ text }}</h2>

    <!-- Container for the product list and slider -->
    <div class="product-list">
      <!-- Product slider container with mouse event handlers for dragging functionality -->
      <div
          class="product-list-container"
          ref="productSlider"
          @mousedown="handleMouseDown"
          @mousemove="handleMouseMove"
          @mouseup="handleMouseUp"
          @mouseleave="handleMouseLeave"
      >
        <!-- Display products if the productList array has items -->
        <div v-if="productList.length > 0" class="product-slider">
          <!-- Loop through each product in the productList -->
          <div
              v-for="product in productList"
              :key="product.SKU"
              class="product"
              @click="selectProduct(product)"
          >
            <!-- Product Image with fallback to a placeholder if Image URL is not available -->
            <div class="image-container">
              <img
                  :src="product.Image || getProductImage(product.SKU)"
                  alt="product image"
                  class="product-image"
              />
            </div>
            <!-- Display the product's SKU -->
            <div class="product-id">{{ product.SKU }}</div>
            <!-- Container for product name and price -->
            <div class="product-details">
              <div class="product-name">{{ product.name }}</div>
              <div class="product-price">{{ product.price }} $</div>
            </div>
          </div>
        </div>

        <!-- Display a message if no products are available -->
        <div v-else>
          <div class="product-name" id="empty-title">Oups… <br />Nothing here yet</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * ProductList Component
 * Displays a list of products with slider functionality, allowing users to select products.
 */
export default {
  props: {
    /**
     * Array of products to display.
     * Each product should have at least SKU, name, price, Image, and Details properties.
     * @type {Array}
     */
    productList: {
      type: Array,
      default: () => [] // Ensure default is an empty array to avoid undefined
    },
    /**
     * Text to display as the header of the product list.
     * @type {String}
     */
    text: {
      type: String,
      default: 'Products'
    },
    /**
     * Flag indicating if the product list is empty.
     * @type {Boolean}
     */
    isEmpty: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      /**
       * Cache to store fetched product images to minimize redundant requests.
       * @type {Object}
       */
      imageCache: {},
      /**
       * Starting X-coordinate for mouse drag.
       * @type {Number}
       */
      startX: 0,
      /**
       * Current scroll position of the product slider.
       * @type {Number}
       */
      scrollLeft: 0,
      /**
       * Flag to indicate if the slider is being dragged.
       * @type {Boolean}
       */
      isDragging: false,
      /**
       * Internal state to track if the product list is empty.
       * Initialized based on the isEmpty prop.
       * @type {Boolean}
       */
      internalIsEmpty: this.isEmpty,
    };
  },
  methods: {
    /**
     * Emits an event to notify the parent component that a product has been selected.
     * @param {Object} product - The product object that was selected.
     */
    selectProduct(product) {
      this.$emit("productSelected", product);
    },

    /**
     * Fetches the list of products from the API.
     * Emits an event to update the productList in the parent component and caches product images.
     */
    fetchProducts() {
      fetch("https://com.servhub.fr/api/products")
          .then((response) => response.json())
          .then((result) => {
            this.$emit("updateProducts", result); // Emit to parent to update productList
            result.forEach((product) => this.getProductImage(product.SKU));
          })
          .catch((error) => console.log("Error fetching products:", error));
    },

    /**
     * Updates the products in the component's state.
     * @param {Array} products - The array of product objects fetched from the API.
     */
    updateProducts(products) {
      this.$emit("updateProducts", products); // Ensure the parent updates the productList
      this.internalIsEmpty = products.length === 0;
    },

    /**
     * Retrieves the product image URL from the cache or assigns a placeholder if not available.
     * @param {String} SKU - The SKU code of the product.
     * @returns {String} The URL of the product image.
     */
    getProductImage(SKU) {
      if (this.imageCache[SKU]) {
        return this.imageCache[SKU];
      }

      // Placeholder logic for fetching or assigning product images
      const productImageUrl = `https://via.placeholder.com/100?text=${SKU}`;
      this.imageCache[SKU] = productImageUrl;
      return productImageUrl;
    },

    /**
     * Handles the mouse down event to initiate dragging.
     * @param {MouseEvent} event - The mouse event object.
     */
    handleMouseDown(event) {
      this.isDragging = true;
      this.startX = event.pageX - this.$refs.productSlider.offsetLeft;
      this.scrollLeft = this.$refs.productSlider.scrollLeft;
    },

    /**
     * Handles the mouse move event to perform scrolling while dragging.
     * @param {MouseEvent} event - The mouse event object.
     */
    handleMouseMove(event) {
      if (!this.isDragging) return;
      event.preventDefault();
      const x = event.pageX - this.$refs.productSlider.offsetLeft;
      const walk = (x - this.startX) * 2; // Scroll-fast multiplier
      this.$refs.productSlider.scrollLeft = this.scrollLeft - walk;
    },

    /**
     * Handles the mouse up event to stop dragging.
     */
    handleMouseUp() {
      this.isDragging = false;
    },

    /**
     * Handles the mouse leave event to stop dragging if the cursor leaves the slider area.
     */
    handleMouseLeave() {
      this.isDragging = false;
    },
  },
  mounted() {
    /**
     * Lifecycle hook called when the component is mounted.
     * Initiates fetching of products.
     */
    this.fetchProducts();
  },
  watch: {
    /**
     * Watches for changes in the productList prop to update internal state.
     * @param {Array} newVal - The new value of productList.
     */
    productList(newVal) {
      this.internalIsEmpty = newVal.length === 0;
    },
  },
};
</script>

<style scoped>

.product-list-container {
  display: flex;
  overflow-x: auto; /* Enable native horizontal scrolling */
  scroll-behavior: smooth; /* Enable smooth scrolling */
}

.product-slider {
  display: flex; /* Align the products horizontally */
  flex-wrap: nowrap; /* Prevent wrapping of products */
  gap: .625rem; /* Add some space between products */
}

.product {
  min-width: 12rem;
  max-width: 12rem;
  height: 11rem;
  padding: .625rem;
  border-radius: 1.25rem;
  background: #d0e7eb;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  margin: .625rem;
  display: flex;
  flex-direction: column;
  flex: 0 0 auto; /* Ensure each product is a fixed size */
  transition: transform 0.2s ease-in-out;
  scroll-snap-align: center; /* Optional: make the product snap to center when scrolling */
  cursor: pointer;
}

.product:hover {
  transform: scale(1.05);
}

.image-container {
  width: auto;
  height: 9rem;
}

.product-image {
  object-fit: contain;
  max-width: 100%;
  border-radius: 15%;
  max-height: 60%;
  margin: 1.25rem auto;
}

.product-id {
  position: absolute;
  top: .625rem;
  right: .625rem;
  font-size: .875rem;
  font-weight: bold;
  color: #333;
}

.product-details {
  position: absolute;
  left: .625rem;
  bottom: 0.5rem;
  text-align: left;
}

.product-name {
  font-size: 1.125rem;
  font-weight: bold;
  width: 11rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.product-price {
  font-size: 1.125rem;
  color: #000;
}

button {
  background-color: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  position: absolute;
  right: 1.25rem;
}

button:focus {
  outline: none;
}

</style>