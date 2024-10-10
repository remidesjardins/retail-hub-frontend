<!--
  =====================================================
  Project: RetailHub
  File: ProductDetails.vue
  Description: Component for displaying detailed information about a product, including functionalities to add to cart, modify, or delete the product.
  Participants:
    - Alexandre Borny
    - Maël Castellan
    - Laura Donato
    - Rémi Desjardins
  =====================================================
-->

<template>
  <!-- Overlay container to focus on the Product Details modal -->
  <div class="overlay" @click.self="closeDetails">
    <!-- Product Details container -->
    <div class="product-details" @click.stop>
      <!-- Close button to exit the Product Details modal -->
      <span class="close-button" @click="closeDetails">
        <i class="fa-solid fa-xmark fa-2xl"></i>
      </span>

      <!-- Left section: Image, Category, Price, and Cart Controls -->
      <div class="left-content">
        <!-- Product Title -->
        <h1 class="product-title">{{ product.name }}</h1>
        <!-- Product Category Label -->
        <span class="category-label">{{ product.category }}</span>
        <!-- Product SKU -->
        <span class="sku">{{ product.SKU }}</span>
        <!-- Product Image -->
        <img :src="product.Image || productImage" alt="Product image" />

        <!-- Stock Information -->
        <div class="stock-info">
          <span>Available stock:</span>
          <div class="stock-level">
            <span class="stock-number">{{ product.Current_stock }}</span>
            <span class="stock-location">{{ product.Slot }}</span>
          </div>
        </div>

        <!-- Product Price -->
        <div class="price">{{ product.price }} $</div>

        <!-- Cart Controls: Add to Cart or Update Quantity -->
        <div v-if="isProductInCart" class="cart-quantity">
          <button class="cart-btn" @click="decrementQuantity">-</button>
          <span class="quantity-number">{{ productQuantityInCart }}</span>
          <button class="cart-btn" @click="incrementQuantity">+</button>
        </div>
        <button
            v-else
            class="add-to-cart"
            @click="addToCart(product)"
        >
          Add to cart
        </button>
      </div>

      <!-- Right section: Product Overview -->
      <div class="summary">
        <h3>Overview</h3>
        <p>{{ product.Details }}</p>
      </div>

      <!-- Action Icons: Modify and Delete Product -->
      <div class="bottom-right-buttons" v-if="isAdmin">
        <button @click="showUpdateForm = true" class="icon-button">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button @click="deleteProduct(product.SKU)" class="icon-button delete-button">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  </div>

  <!-- Update Form Modal: ModifyProductForm Component -->
  <div v-if="showUpdateForm" class="overlay">
    <ModifyProductForm
        :productSKU="product.SKU"
        @close="showUpdateForm = false"
    />
  </div>
</template>

<script>
/**
 * ProductDetails Component
 * Displays detailed information about a product and provides functionalities to add the product to the cart, modify its details, or delete it.
 */
import ModifyProductForm from '@/components/ModifyProductForm.vue'; // Path to ModifyProductForm component
import throttle from 'lodash/throttle';

export default {
  props: {
    /**
     * The product object containing all details about the product.
     * @type {Object}
     * @required
     */
    product: {
      type: Object,
      required: true,
    },
    /**
     * Visibility flag to control the display of the Product Details modal.
     * @type {Boolean}
     */
    visible: Boolean,
  },
  data() {
    return {
      /**
       * Controls the visibility of the ModifyProductForm component.
       * @type {Boolean}
       */
      showUpdateForm: false,
      /**
       * Default product image URL displayed if the product does not have one.
       * @type {String}
       */
      productImage: "https://via.placeholder.com/150?text=No+Image",
      /**
       * Allows to know if we need to shows some features
       */
      isAdmin: this.$store.state.userIsAdmin
    };
  },
  computed: {
    /**
     * Determines if the product is already in the cart by checking the store's bagContents.
     * @returns {Boolean}
     */
    isProductInCart() {
      return this.$store.state.bagContents.some(item => item.product._id === this.product._id);
    },
    /**
     * Retrieves the quantity of the product in the cart from the store.
     * @returns {Number}
     */
    productQuantityInCart() {
      const cartItem = this.$store.state.bagContents.find(item => item.product._id === this.product._id);
      return cartItem ? cartItem.quantity : 0;
    },
  },
  methods: {
    /**
     * Deletes the product by sending a DELETE request to the API.
     * Confirms the action with the user before proceeding.
     * @param {String} productSKU - The SKU of the product to be deleted.
     */
    deleteProduct(productSKU) {
      const token = this.$store.state.userToken;

      if (confirm("Are you sure you want to delete this product?")) {
        // Send DELETE request to the backend
        fetch(`https://com.servhub.fr/api/products/${productSKU}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
            .then(response => {
              if (response.ok) {
                console.log(`Product ${productSKU} deleted successfully.`);
                this.$emit('productDeleted', productSKU);
              } else {
                alert('Failed to delete the product.');
              }
            })
            .catch(error => {
              console.error('Error deleting product:', error);
              alert('An error occurred while deleting the product.');
            });
      }
    },

    /**
     * Navigates the user to the UpdateProduct page with the specific productSKU.
     * @param {String} productSKU - The SKU of the product to be updated.
     */
    goToUpdateProduct(productSKU) {
      this.$router.push({ name: "UpdateProduct", params: { productSKU } });
    },

    /**
     * Closes the Product Details modal by emitting a 'close' event to the parent component.
     */
    closeDetails() {
      this.$emit('close');
    },

    /**
     * Sets the default product image if the product does not have one.
     */
    fetchProductImage() {
      if (!this.product.Image) {
        this.productImage = "https://via.placeholder.com/150?text=No+Image";
      }
    },

    /**
     * Adds the product to the cart by committing to the Vuex store.
     * Also handles receipt and ticket checks through store actions.
     * @param {Object} product - The product object to be added to the cart.
     */
    addToCart(product) {
      this.$store.commit("addToCart", product);
      this.$store.dispatch("handleReceipt", { payload: product, number: -1 });
      // No need to set productInCart manually as it's computed

      // Dispatch handleCheckTicket after 5 minutes (300,000 ms)
      setTimeout(() => {
        this.$store.dispatch("handleCheckTicket", product);
      }, 300000);
    },

    /**
     * Increments the quantity of the product in the cart.
     * Uses throttling to prevent multiple rapid clicks.
     */
    incrementQuantity: throttle(function() {
      this.$store.commit("updateQuantity", { _id: this.product._id, quantity: this.productQuantityInCart + 1 });
      this.$store.dispatch("handleReceipt", { payload: this.product, number: -1 });
    }, 500), // Prevent multiple clicks within 500ms

    /**
     * Decrements the quantity of the product in the cart.
     * Removes the product from the cart if the quantity reaches zero.
     * Uses throttling to prevent multiple rapid clicks.
     */
    decrementQuantity: throttle(function() {
      if (this.productQuantityInCart > 1) {
        this.$store.commit("updateQuantity", { _id: this.product._id, quantity: this.productQuantityInCart - 1 });
        this.$store.dispatch("handleReceipt", { payload: this.product, number: 1 });
      } else {
        const quantityToRelease = this.productQuantityInCart;
        this.$store.commit("removeFromCart", { product: this.product });
        this.$store.dispatch("handleReceipt", { payload: this.product, number: quantityToRelease });
      }
    }, 500),
  },
  components: {
    /**
     * Importing the ModifyProductForm component for updating product details.
     */
    ModifyProductForm,
  },
  mounted() {
    /**
     * Lifecycle hook called when the component is mounted.
     * Initializes the product image.
     */
    this.fetchProductImage(); // Fetch the product image on mount
    console.log('Product details:', this.product);
  },
};
</script>

<style scoped>

h1 {
  margin-bottom: 1rem;
}

/* Overlay Styles */
.overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);  /* Darkened background */
  z-index: 999;  /* Ensure it's on top */
}

.product-details {
  background-color: white;
  border-radius: 1.875rem; /* Rounded corners */
  padding: 1.25rem;
  max-width: 56.25rem;
  max-height: 90vh;
  width: 56.25rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  z-index: 10;
  overflow: hidden; /* Ensure content stays inside the rounded borders */
}

.left-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40%;
}

.left-content img {
  width: 9.375rem;
  margin-bottom: .625rem;
}

.left-content .product-title {
  text-align: left;
  font-size: 1.563rem;
  font-weight: bold;
}

.price {
  font-size: 1.5rem;
  margin-bottom: .625rem;
}

.add-to-cart {
  width: 100%;
  padding: .938rem;
  border: none;
  border-radius: 1.563rem;
  background-color: #d3d3d3;
  color: black;
  font-size: 1.125rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: .625rem;
}

.summary {
  width: 55%;
  position: sticky !important;
  top: 10%;
}

.summary h3 {
  margin-bottom: .625rem;
}

.close-button {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  cursor: pointer;
}

.category-label {
  background-color: orange;
  border-radius: .625rem;
  padding: .313rem .625rem;
  margin-bottom: 1.25rem;
  color: white;
  font-weight: bold;
  font-size: 1rem;
}

.stock-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.25rem;
}

.stock-level {
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
}

.stock-number {
  background-color: green;
  border-radius: 50%;
  padding: .625rem;
  color: white;
  font-weight: bold;
  margin-right: .625rem;
}

.stock-location {
  color: #333;
}

.bottom-right-buttons {
  position: absolute;
  bottom: 1.25rem;
  right: 1.25rem;
  display: flex;
  gap: 1.5rem;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 2rem;
  color: #007bff;
}

.icon-button:hover {
  color: #0056b3;
}

.delete-button {
  color: red;
}

.delete-button:hover {
  color: darkred;
}

.add-to-cart {
  width: 100%;
  padding: .938rem;
  border: none;
  border-radius: 1.563rem;
  background-color: #80cbc4; /* Custom blue for the add-to-cart button */
  color: white;
  font-size: 1.125rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: .625rem;
  transition: background-color 0.3s ease;
}

.add-to-cart:hover {
  background-color: #5d8f8d; /* Darker blue on hover */
}

/* Quantity buttons container */
.cart-quantity {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.cart-btn {
  padding: .625rem .938rem;
  background-color: darkgray;
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 50%;
  margin: .313rem;
  transition: all 0.2s ease;
  animation: bounce 0.3s; /* Add bounce animation */
}

.cart-btn:hover {
  background-color: #737272;
}

/* Keyframes for bounce animation */
@keyframes bounce {
  0% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.2);
  }
  60% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}

.quantity-number {
  font-size: 1.125rem;
  margin: 0 .938rem;
}

</style>