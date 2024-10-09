---
title: ProductDetails
---
# Introduction

This document will walk you through the implementation of the <SwmToken path="/frontend/src/components/ProductDetails.vue" pos="4:4:4" line-data="  File: ProductDetails.vue">`ProductDetails`</SwmToken> feature.

The feature displays detailed information about a product, including functionalities to add to cart, modify, or delete the product.

We will cover:

1. How the component is structured.
2. How product data is managed.
3. How user interactions are handled.

# Component structure

The <SwmToken path="/frontend/src/components/ProductDetails.vue" pos="4:4:4" line-data="  File: ProductDetails.vue">`ProductDetails`</SwmToken> component is defined in <SwmPath>[frontend/src/components/ProductDetails.vue](/frontend/src/components/ProductDetails.vue)</SwmPath>. It includes a template for displaying product details and various controls for user interactions.

<SwmSnippet path="/frontend/src/components/ProductDetails.vue" line="14">

---

The template starts with an overlay container to focus on the Product Details modal and includes a close button to exit the modal.

```
<template>
  <!-- Overlay container to focus on the Product Details modal -->
  <div class="overlay" @click.self="closeDetails">
    <!-- Product Details container -->
    <div class="product-details" @click.stop>
      <!-- Close button to exit the Product Details modal -->
      <span class="close-button" @click="closeDetails">
        <i class="fa-solid fa-xmark fa-2xl"></i>
      </span>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ProductDetails.vue" line="23">

---

The left section of the template displays the product's image, category, SKU, and controls for adding to the cart or updating the quantity.

```

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
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ProductDetails.vue" line="34">

---

Stock information is displayed to show the available stock and its location.

```

        <!-- Stock Information -->
        <div class="stock-info">
          <span>Available stock:</span>
          <div class="stock-level">
            <span class="stock-number">{{ product.Current_stock }}</span>
            <span class="stock-location">{{ product.Slot }}</span>
          </div>
        </div>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ProductDetails.vue" line="43">

---

The product price and cart controls are included, allowing users to add the product to the cart or update the quantity if it's already in the cart.

```

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
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ProductDetails.vue" line="61">

---

The right section provides an overview of the product and action icons for modifying or deleting the product.

```

      <!-- Right section: Product Overview -->
      <div class="summary">
        <h3>Overview</h3>
        <p>{{ product.Details }}</p>
      </div>

      <!-- Action Icons: Modify and Delete Product -->
      <div class="bottom-right-buttons">
        <button @click="showUpdateForm = true" class="icon-button">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button @click="deleteProduct(product.SKU)" class="icon-button delete-button">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  </div>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ProductDetails.vue" line="79">

---

An update form modal is conditionally rendered to allow users to modify product details.

```

  <!-- Update Form Modal: ModifyProductForm Component -->
  <div v-if="showUpdateForm" class="overlay">
    <ModifyProductForm
        :productSKU="product.SKU"
        @close="showUpdateForm = false"
    />
  </div>
</template>
```

---

</SwmSnippet>

# Managing product data

<SwmSnippet path="/frontend/src/components/ProductDetails.vue" line="98">

---

The component accepts a <SwmToken path="/frontend/src/components/ProductDetails.vue" pos="100:5:5" line-data="     * The product object containing all details about the product.">`product`</SwmToken> object and a <SwmToken path="/frontend/src/components/ProductDetails.vue" pos="112:1:1" line-data="    visible: Boolean,">`visible`</SwmToken> flag as props. The <SwmToken path="/frontend/src/components/ProductDetails.vue" pos="100:5:5" line-data="     * The product object containing all details about the product.">`product`</SwmToken> object contains all details about the product, while the <SwmToken path="/frontend/src/components/ProductDetails.vue" pos="112:1:1" line-data="    visible: Boolean,">`visible`</SwmToken> flag controls the display of the Product Details modal.

```
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
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ProductDetails.vue" line="114">

---

The component's data includes a flag to control the visibility of the <SwmToken path="/frontend/src/components/ProductDetails.vue" pos="117:13:13" line-data="       * Controls the visibility of the ModifyProductForm component.">`ModifyProductForm`</SwmToken> component and a default product image URL.

```
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
    };
  },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ProductDetails.vue" line="128">

---

Computed properties determine if the product is already in the cart and retrieve the quantity of the product in the cart from the store.

```
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
```

---

</SwmSnippet>

# Handling user interactions

<SwmSnippet path="/frontend/src/components/ProductDetails.vue" line="146">

---

The <SwmToken path="/frontend/src/components/ProductDetails.vue" pos="151:1:1" line-data="    deleteProduct(productSKU) {">`deleteProduct`</SwmToken> method sends a DELETE request to the API to remove the product, confirming the action with the user before proceeding.

@param {String} <SwmToken path="/frontend/src/components/ProductDetails.vue" pos="151:3:3" line-data="    deleteProduct(productSKU) {">`productSKU`</SwmToken> - The SKU of the product to be deleted.

```
    /**
     * Deletes the product by sending a DELETE request to the API.
     * Confirms the action with the user before proceeding.
     * @param {String} productSKU - The SKU of the product to be deleted.
     */
    deleteProduct(productSKU) {
      if (confirm("Are you sure you want to delete this product?")) {
        // Send DELETE request to the backend
        fetch(`https://com.servhub.fr/api/products/${productSKU}`, {
          method: 'DELETE',
          headers: {
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
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ProductDetails.vue" line="175">

---

The <SwmToken path="/frontend/src/components/ProductDetails.vue" pos="179:1:1" line-data="    goToUpdateProduct(productSKU) {">`goToUpdateProduct`</SwmToken> method navigates the user to the <SwmToken path="/frontend/src/components/ProductDetails.vue" pos="176:13:13" line-data="     * Navigates the user to the UpdateProduct page with the specific productSKU.">`UpdateProduct`</SwmToken> page with the specific product SKU.

@param {String} <SwmToken path="/frontend/src/components/ProductDetails.vue" pos="179:3:3" line-data="    goToUpdateProduct(productSKU) {">`productSKU`</SwmToken> - The SKU of the product to be updated.

```
    /**
     * Navigates the user to the UpdateProduct page with the specific productSKU.
     * @param {String} productSKU - The SKU of the product to be updated.
     */
    goToUpdateProduct(productSKU) {
      this.$router.push({ name: "UpdateProduct", params: { productSKU } });
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ProductDetails.vue" line="183">

---

The <SwmToken path="/frontend/src/components/ProductDetails.vue" pos="186:1:1" line-data="    closeDetails() {">`closeDetails`</SwmToken> method closes the Product Details modal by emitting a 'close' event to the parent component.

```
    /**
     * Closes the Product Details modal by emitting a 'close' event to the parent component.
     */
    closeDetails() {
      this.$emit('close');
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ProductDetails.vue" line="190">

---

The <SwmToken path="/frontend/src/components/ProductDetails.vue" pos="193:1:1" line-data="    fetchProductImage() {">`fetchProductImage`</SwmToken> method sets the default product image if the product does not have one.

```
    /**
     * Sets the default product image if the product does not have one.
     */
    fetchProductImage() {
      if (!this.product.Image) {
        this.productImage = "https://via.placeholder.com/150?text=No+Image";
      }
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ProductDetails.vue" line="199">

---

The <SwmToken path="/frontend/src/components/ProductDetails.vue" pos="204:1:1" line-data="    addToCart(product) {">`addToCart`</SwmToken> method adds the product to the cart by committing to the Vuex store and handles receipt and ticket checks through store actions.

@param {Object} <SwmToken path="/frontend/src/components/ProductDetails.vue" pos="204:3:3" line-data="    addToCart(product) {">`product`</SwmToken> - The product object to be added to the cart.

```
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
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ProductDetails.vue" line="215">

---

The <SwmToken path="/frontend/src/components/ProductDetails.vue" pos="219:1:1" line-data="    incrementQuantity: throttle(function() {">`incrementQuantity`</SwmToken> method increments the quantity of the product in the cart, using throttling to prevent multiple rapid clicks.

```
    /**
     * Increments the quantity of the product in the cart.
     * Uses throttling to prevent multiple rapid clicks.
     */
    incrementQuantity: throttle(function() {
      this.$store.commit("updateQuantity", { _id: this.product._id, quantity: this.productQuantityInCart + 1 });
      this.$store.dispatch("handleReceipt", { payload: this.product, number: -1 });
    }, 500), // Prevent multiple clicks within 500ms
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ProductDetails.vue" line="224">

---

The <SwmToken path="/frontend/src/components/ProductDetails.vue" pos="49:16:16" line-data="          &lt;button class=&quot;cart-btn&quot; @click=&quot;decrementQuantity&quot;&gt;-&lt;/button&gt;">`decrementQuantity`</SwmToken> method decrements the quantity of the product in the cart, removing the product if the quantity reaches zero, also using throttling.

```
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
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ProductDetails.vue" line="240">

---

The component imports the <SwmToken path="/frontend/src/components/ProductDetails.vue" pos="80:10:10" line-data="  &lt;!-- Update Form Modal: ModifyProductForm Component --&gt;">`ModifyProductForm`</SwmToken> component for updating product details.

```
  components: {
    /**
     * Importing the ModifyProductForm component for updating product details.
     */
    ModifyProductForm,
  },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ProductDetails.vue" line="246">

---

The <SwmToken path="/frontend/src/components/ProductDetails.vue" pos="246:1:1" line-data="  mounted() {">`mounted`</SwmToken> lifecycle hook initializes the product image when the component is mounted.

```
  mounted() {
    /**
     * Lifecycle hook called when the component is mounted.
     * Initializes the product image.
     */
    this.fetchProductImage(); // Fetch the product image on mount
    console.log('Product details:', this.product);
  },
```

---

</SwmSnippet>

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBUmV0YWlsSFVCLUZyb250ZW5kJTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="RetailHUB-Frontend"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
