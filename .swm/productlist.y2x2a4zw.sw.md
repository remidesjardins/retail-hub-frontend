---
title: ProductList
---
# Introduction

This document will walk you through the implementation of the <SwmToken path="/frontend/src/components/ProductList.vue" pos="31:11:11" line-data="        &lt;!-- Display products if the productList array has items --&gt;">`productList`</SwmToken> component in the <SwmToken path="/frontend/src/components/ProductList.vue" pos="3:4:4" line-data="  Project: RetailHub">`RetailHub`</SwmToken> project.

The <SwmToken path="/frontend/src/components/ProductList.vue" pos="31:11:11" line-data="        &lt;!-- Display products if the productList array has items --&gt;">`productList`</SwmToken> component displays a list of products with slider functionality, allowing users to select products or view detailed information.

We will cover:

1. How the component structure is defined.
2. How products are fetched and displayed.
3. How the slider functionality is implemented.
4. How the component interacts with parent components.

# Component structure

The <SwmToken path="/frontend/src/components/ProductList.vue" pos="31:11:11" line-data="        &lt;!-- Display products if the productList array has items --&gt;">`productList`</SwmToken> component is defined in <SwmPath>[frontend/src/components/ProductList.vue](/frontend/src/components/ProductList.vue)</SwmPath>. It includes a template for displaying products, props for passing data, and data properties for internal state management.

<SwmSnippet path="/frontend/src/components/ProductList.vue" line="14">

---

The main container for the product list and slider is defined in the template:

```
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
            <img
                :src="product.Image || getProductImage(product.SKU)"
                alt="product image"
                class="product-image"
            />
            <!-- Display the product's SKU -->
            <div class="product-id">{{ product.SKU }}</div>
            <!-- Container for product name and price -->
            <div class="product-details">
              <div class="product-name">{{ product.name }}</div>
              <div class="product-price">{{ product.price }} $</div>
            </div>
          </div>
        </div>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ProductList.vue" line="55">

---

If no products are available, a message is displayed:

```

        <!-- Display a message if no products are available -->
        <div v-else>
          <div class="product-name" id="empty-title">Oups… <br />Nothing here yet</div>
        </div>
      </div>
    </div>
  </div>
</template>
```

---

</SwmSnippet>

# Props and data

<SwmSnippet path="/frontend/src/components/ProductList.vue" line="71">

---

The component accepts several props to configure its behavior:

```
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
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ProductList.vue" line="98">

---

The data properties manage internal state, including caching images and handling the slider's drag functionality:

```
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
```

---

</SwmSnippet>

# Product selection and fetching

<SwmSnippet path="/frontend/src/components/ProductList.vue" line="129">

---

When a product is selected, an event is emitted to notify the parent component:

@param {Object} <SwmToken path="/frontend/src/components/ProductList.vue" pos="133:3:3" line-data="    selectProduct(product) {">`product`</SwmToken> - The product object that was selected.

```
    /**
     * Emits an event to notify the parent component that a product has been selected.
     * @param {Object} product - The product object that was selected.
     */
    selectProduct(product) {
      this.$emit("productSelected", product);
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ProductList.vue" line="137">

---

Products are fetched from an API when the component is mounted. The fetched products are then emitted to the parent component and their images are cached:

```
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
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ProductList.vue" line="151">

---

The fetched products are also used to update the component's internal state:

@param {Array} <SwmToken path="/frontend/src/components/ProductList.vue" pos="155:3:3" line-data="    updateProducts(products) {">`products`</SwmToken> - The array of product objects fetched from the API.

```
    /**
     * Updates the products in the component's state.
     * @param {Array} products - The array of product objects fetched from the API.
     */
    updateProducts(products) {
      this.$emit("updateProducts", products); // Ensure the parent updates the productList
      this.internalIsEmpty = products.length === 0;
    },
```

---

</SwmSnippet>

# Image handling

<SwmSnippet path="/frontend/src/components/ProductList.vue" line="160">

---

The <SwmToken path="/frontend/src/components/ProductList.vue" pos="165:1:1" line-data="    getProductImage(SKU) {">`getProductImage`</SwmToken> method retrieves the product image URL from the cache or assigns a placeholder if not available:

@param {String} <SwmToken path="/frontend/src/components/ProductList.vue" pos="165:3:3" line-data="    getProductImage(SKU) {">`SKU`</SwmToken> - The SKU code of the product.\
@returns {String} The URL of the product image.

```
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
```

---

</SwmSnippet>

# Slider functionality

<SwmSnippet path="/frontend/src/components/ProductList.vue" line="176">

---

The slider functionality is implemented using mouse event handlers. The <SwmToken path="/frontend/src/components/ProductList.vue" pos="180:1:1" line-data="    handleMouseDown(event) {">`handleMouseDown`</SwmToken> method initiates dragging:

@param {MouseEvent} <SwmToken path="/frontend/src/components/ProductList.vue" pos="180:3:3" line-data="    handleMouseDown(event) {">`event`</SwmToken> - The mouse event object.

```
    /**
     * Handles the mouse down event to initiate dragging.
     * @param {MouseEvent} event - The mouse event object.
     */
    handleMouseDown(event) {
      this.isDragging = true;
      this.startX = event.pageX - this.$refs.productSlider.offsetLeft;
      this.scrollLeft = this.$refs.productSlider.scrollLeft;
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ProductList.vue" line="186">

---

The <SwmToken path="/frontend/src/components/ProductList.vue" pos="190:1:1" line-data="    handleMouseMove(event) {">`handleMouseMove`</SwmToken> method performs scrolling while dragging:

@param {MouseEvent} <SwmToken path="/frontend/src/components/ProductList.vue" pos="190:3:3" line-data="    handleMouseMove(event) {">`event`</SwmToken> - The mouse event object.

```
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
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ProductList.vue" line="198">

---

The <SwmToken path="/frontend/src/components/ProductList.vue" pos="201:1:1" line-data="    handleMouseUp() {">`handleMouseUp`</SwmToken> method stops dragging:

```
    /**
     * Handles the mouse up event to stop dragging.
     */
    handleMouseUp() {
      this.isDragging = false;
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ProductList.vue" line="205">

---

The <SwmToken path="/frontend/src/components/ProductList.vue" pos="208:1:1" line-data="    handleMouseLeave() {">`handleMouseLeave`</SwmToken> method stops dragging if the cursor leaves the slider area:

```
    /**
     * Handles the mouse leave event to stop dragging if the cursor leaves the slider area.
     */
    handleMouseLeave() {
      this.isDragging = false;
    },
```

---

</SwmSnippet>

# Component lifecycle

<SwmSnippet path="/frontend/src/components/ProductList.vue" line="212">

---

When the component is mounted, it initiates fetching of products:

```
  mounted() {
    /**
     * Lifecycle hook called when the component is mounted.
     * Initiates fetching of products.
     */
    this.fetchProducts();
  },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ProductList.vue" line="219">

---

The component watches for changes in the <SwmToken path="/frontend/src/components/ProductList.vue" pos="221:13:13" line-data="     * Watches for changes in the productList prop to update internal state.">`productList`</SwmToken> prop to update its internal state:

@param {Array} <SwmToken path="/frontend/src/components/ProductList.vue" pos="224:3:3" line-data="    productList(newVal) {">`newVal`</SwmToken> - The new value of productList.

```
  watch: {
    /**
     * Watches for changes in the productList prop to update internal state.
     * @param {Array} newVal - The new value of productList.
     */
    productList(newVal) {
      this.internalIsEmpty = newVal.length === 0;
    },
  },
```

---

</SwmSnippet>

This concludes the walkthrough of the <SwmToken path="/frontend/src/components/ProductList.vue" pos="31:11:11" line-data="        &lt;!-- Display products if the productList array has items --&gt;">`productList`</SwmToken> component. The implementation ensures that products are fetched, displayed, and interactively browsed using a slider. The component also communicates with its parent component to keep the product list updated.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBUmV0YWlsSFVCLUZyb250ZW5kJTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="RetailHUB-Frontend"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
