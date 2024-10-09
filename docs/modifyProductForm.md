---
title: ModifyProductForm
---
# Introduction

This document will walk you through the implementation of the <SwmToken path="/frontend/src/components/ModifyProductForm.vue" pos="4:4:4" line-data="  File: ModifyProductForm.vue">`ModifyProductForm`</SwmToken> feature.

The feature allows users to modify existing products within the <SwmToken path="/frontend/src/components/ModifyProductForm.vue" pos="3:4:4" line-data="  Project: RetailHub">`RetailHub`</SwmToken> application.

We will cover:

1. The structure and layout of the form.
2. How product details are fetched and displayed.
3. How categories are managed and selected.
4. The process of submitting the modified product details.

# Form structure and layout

<SwmSnippet path="/frontend/src/components/ModifyProductForm.vue" line="14">

---

The main container for the Modify Product form is defined in the template. It includes a header with a title and a close button.

```
<template>
  <!-- Main container for the Modify Product form -->
  <div class="modify-product-form">
    <!-- Form header with title and close button -->
    <div class="form-header">
      <h2>Modify Product</h2>
      <button @click="$emit('close')" class="close-btn">
        <i class="fa-solid fa-xmark fa-xl"></i>
      </button>
    </div>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ModifyProductForm.vue" line="24">

---

The form itself is structured to include inputs for various product details such as name, SKU, price, image URL, and slot.

```

    <!-- Form for modifying the product details -->
    <form @submit.prevent="modifyProduct">
      <!-- Row containing Product Name, SKU, and Price inputs -->
      <div class="form-row">
        <!-- Product Name Input -->
        <div class="form-group">
          <label for="name">Product Name</label>
          <input
              type="text"
              id="name"
              v-model="product.name"
              placeholder="Enter product name"
              required
          />
        </div>

        <!-- SKU Input -->
        <div class="form-group">
          <label for="sku">SKU</label>
          <input
              type="text"
              id="sku"
              v-model="product.SKU"
              placeholder="Enter SKU"
              required
          />
        </div>

        <!-- Price Input -->
        <div class="form-group">
          <label for="price">Price</label>
          <input
              type="number"
              id="price"
              v-model="product.price"
              step="any"
              placeholder="Enter price"
              required
          />
        </div>
      </div>

      <!-- Row containing Image URL and Slot inputs -->
      <div class="form-row">
        <!-- Image URL Input -->
        <div class="form-group">
          <label for="Image">Image URL</label>
          <input
              type="text"
              id="Image"
              v-model="product.Image"
              placeholder="Enter an URL"
              required
          />
        </div>

        <!-- Slot Input -->
        <div class="form-group">
          <label for="slot">Slot</label>
          <input
              type="text"
              id="Slot"
              v-model="product.Slot"
              placeholder="Enter slot"
              required
          />
        </div>
      </div>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ModifyProductForm.vue" line="93">

---

Additionally, there is a section for selecting a category from a dropdown and a button to add a new category.

```

      <!-- Row containing Category selection and Add Category button -->
      <div class="form-row">
        <div class="form-group category-group">
          <label for="categorySelect" class="category-label">Select Category</label>
          <div class="category-wrapper">
            <!-- Dropdown to select category -->
            <select
                id="categorySelect"
                class="category-select"
                v-model="selectedCategory"
            >
              <option
                  v-for="category in categories"
                  :key="category._id"
                  :value="category._id"
              >
                {{ category.name }}
              </option>
            </select>
            <!-- Button to open CategoryOverlay for adding a new category -->
            <button
                type="button"
                class="category-btn"
                @click="openCategoryOverlay"
            >
              Add Category
            </button>
          </div>
        </div>
      </div>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ModifyProductForm.vue" line="124">

---

An overview text area is provided for entering product details.

```

      <!-- Overview Text Area -->
      <div class="form-group">
        <label for="overview">Overview</label>
        <textarea
            id="overview"
            v-model="product.Details"
            placeholder="Enter product overview"
            required
        ></textarea>
      </div>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ModifyProductForm.vue" line="135">

---

Finally, a submit button is included to handle the form submission.

```

      <!-- Submit button to modify the product -->
      <button type="submit" class="submit-btn">Modify product</button>
    </form>

    <!-- CategoryOverlay component for managing categories -->
    <CategoryOverlay
        :show="showCategoryOverlay"
        :categories="categories"
        @addCategory="addCategory"
        @removeCategory="removeCategory"
        @closeOverlay="closeCategoryOverlay"
    />
  </div>
</template>
```

---

</SwmSnippet>

# Component registration and props

<SwmSnippet path="/frontend/src/components/ModifyProductForm.vue" line="159">

---

The <SwmToken path="/frontend/src/components/ModifyProductForm.vue" pos="159:6:6" line-data="  components: { CategoryOverlay },">`CategoryOverlay`</SwmToken> component is registered to manage categories.

```
  components: { CategoryOverlay },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ModifyProductForm.vue" line="161">

---

The component receives a prop <SwmToken path="/frontend/src/components/ModifyProductForm.vue" pos="163:10:10" line-data="   * @prop {String} productSKU - The SKU of the product to be modified.">`productSKU`</SwmToken> from the parent component, which is used to fetch the product details.

@prop {String} <SwmToken path="/frontend/src/components/ModifyProductForm.vue" pos="165:6:6" line-data="  props: [&#39;productSKU&#39;],">`productSKU`</SwmToken> - The SKU of the product to be modified.

```
  /**
   * Props received from the parent component.
   * @prop {String} productSKU - The SKU of the product to be modified.
   */
  props: ['productSKU'],
```

---

</SwmSnippet>

# Data and lifecycle hooks

<SwmSnippet path="/frontend/src/components/ModifyProductForm.vue" line="167">

---

The data function initializes the product details, visibility of the <SwmToken path="/frontend/src/components/ModifyProductForm.vue" pos="113:9:9" line-data="            &lt;!-- Button to open CategoryOverlay for adding a new category --&gt;">`CategoryOverlay`</SwmToken>, selected category, and available categories.

```
  data() {
    return {
      /**
       * Object holding the product details to be modified.
       */
      product: {
        name: '',
        SKU: '',
        price: '',
        category: '',
        Details: '',
        Image: '',
        Slot: '',
      },
      /**
       * Controls the visibility of the CategoryOverlay component.
       */
      showCategoryOverlay: false,
      /**
       * Currently selected category ID.
       */
      selectedCategory: '',
      /**
       * Array of available categories fetched from the API.
       */
      categories: [],
    };
  },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ModifyProductForm.vue" line="196">

---

The <SwmToken path="/frontend/src/components/ModifyProductForm.vue" pos="197:17:17" line-data="   * Lifecycle hook called when the component is mounted.">`mounted`</SwmToken> lifecycle hook initiates fetching of the product details.

```
  /**
   * Lifecycle hook called when the component is mounted.
   * Initiates fetching of the product details.
   */
  mounted() {
    this.fetchProductDetails();
  },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ModifyProductForm.vue" line="204">

---

The <SwmToken path="/frontend/src/components/ModifyProductForm.vue" pos="205:17:17" line-data="   * Lifecycle hook called when the component is created.">`created`</SwmToken> lifecycle hook initiates fetching of the categories.

```
  /**
   * Lifecycle hook called when the component is created.
   * Initiates fetching of the categories.
   */
  created() {
    this.fetchCategories();
  },
```

---

</SwmSnippet>

# Fetching categories and product details

<SwmSnippet path="/frontend/src/components/ModifyProductForm.vue" line="213">

---

The <SwmToken path="/frontend/src/components/ModifyProductForm.vue" pos="209:3:3" line-data="    this.fetchCategories();">`fetchCategories`</SwmToken> method fetches the list of categories from the API.

```
    /**
     * Fetches the list of categories from the API.
     */
    async fetchCategories() {
      try {
        const response = await fetch('https://com.servhub.fr/api/categories');
        console.log(response);
        if (response.ok) {
          this.categories = await response.json(); // Assume the response is an array of categories
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ModifyProductForm.vue" line="261">

---

The <SwmToken path="/frontend/src/components/ModifyProductForm.vue" pos="201:3:3" line-data="    this.fetchProductDetails();">`fetchProductDetails`</SwmToken> method fetches the details of the product to be modified using its SKU.

```
    /**
     * Fetches the details of the product to be modified using its SKU.
     */
    async fetchProductDetails() {
      try {
        const response = await fetch(`https://com.servhub.fr/api/products/${this.productSKU}`);
        const data = await response.json();
        if (data) {
          this.product = { ...this.product, ...data };
          // Set the selected category based on the fetched product's category
          if (data.category) {
            const category = this.categories.find(cat => cat.name === data.category);
            if (category) {
              this.selectedCategory = category._id;
            }
          }
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    },
```

---

</SwmSnippet>

# Managing categories

<SwmSnippet path="/frontend/src/components/ModifyProductForm.vue" line="230">

---

The <SwmToken path="/frontend/src/components/ModifyProductForm.vue" pos="144:2:2" line-data="        @addCategory=&quot;addCategory&quot;">`addCategory`</SwmToken> method adds a new category to the categories list.

@param {Object} <SwmToken path="/frontend/src/components/ModifyProductForm.vue" pos="234:3:3" line-data="    addCategory(newCategory) {">`newCategory`</SwmToken> - The new category object to be added.

```
    /**
     * Adds a new category to the categories list.
     * @param {Object} newCategory - The new category object to be added.
     */
    addCategory(newCategory) {
      if (newCategory._id && newCategory.name) {
        this.categories.push(newCategory);
        // Optionally, set the newly added category as the selected category
        this.selectedCategory = newCategory._id;
      }
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ModifyProductForm.vue" line="242">

---

The <SwmToken path="/frontend/src/components/ModifyProductForm.vue" pos="145:2:2" line-data="        @removeCategory=&quot;removeCategory&quot;">`removeCategory`</SwmToken> method removes a category from the categories list.

@param {Object} <SwmToken path="/frontend/src/components/ModifyProductForm.vue" pos="246:5:5" line-data="    async removeCategory(category) {">`category`</SwmToken> - The category object to be removed.

```
    /**
     * Removes a category from the categories list.
     * @param {Object} category - The category object to be removed.
     */
    async removeCategory(category) {
      try {
        const response = await fetch(`https://com.servhub.fr/api/categories/${category._id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          this.categories = this.categories.filter(cat => cat._id !== category._id); // Use _id to filter the correct category
        } else {
          console.error('Failed to remove category');
        }
      } catch (error) {
        console.error('Error removing category:', error);
      }
    },
```

---

</SwmSnippet>

# Form submission

<SwmSnippet path="/frontend/src/components/ModifyProductForm.vue" line="283">

---

The <SwmToken path="/frontend/src/components/ModifyProductForm.vue" pos="26:10:10" line-data="    &lt;form @submit.prevent=&quot;modifyProduct&quot;&gt;">`modifyProduct`</SwmToken> method handles the form submission to modify the product. It validates and sends the updated product data to the API.

```
    /**
     * Handles the form submission to modify the product.
     * Validates and sends the updated product data to the API.
     */
    async modifyProduct() {
      console.log("PRODUCT TO MODIFY:", this.product);
      try {
        const selectedCategoryObj = this.categories.find(cat => cat._id === this.selectedCategory);
        if (selectedCategoryObj) {
          this.product.category = selectedCategoryObj.name; // Set the category name
        }
        console.log("Category updated:", this.product.category);
        const response = await fetch(`https://com.servhub.fr/api/products/${this.productSKU}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(this.product),
        });

        const result = await response.json();
        if (response.ok) {
          alert(`Product "${this.product.name}" updated successfully!`);
          this.$emit('close'); // Close the form after successful submission
        } else {
          alert("Error updating product: " + result.message);
        }
      } catch (error) {
        console.error("Error updating product:", error);
      }
    },
```

---

</SwmSnippet>

# Category overlay management

<SwmSnippet path="/frontend/src/components/ModifyProductForm.vue" line="315">

---

The <SwmToken path="/frontend/src/components/ModifyProductForm.vue" pos="117:5:5" line-data="                @click=&quot;openCategoryOverlay&quot;">`openCategoryOverlay`</SwmToken> method opens the <SwmToken path="/frontend/src/components/ModifyProductForm.vue" pos="113:9:9" line-data="            &lt;!-- Button to open CategoryOverlay for adding a new category --&gt;">`CategoryOverlay`</SwmToken> component to allow adding a new category.

```
    /**
     * Opens the CategoryOverlay component to allow adding a new category.
     */
    openCategoryOverlay() {
      this.showCategoryOverlay = true;
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ModifyProductForm.vue" line="322">

---

The <SwmToken path="/frontend/src/components/ModifyProductForm.vue" pos="146:5:5" line-data="        @closeOverlay=&quot;closeCategoryOverlay&quot;">`closeCategoryOverlay`</SwmToken> method closes the <SwmToken path="/frontend/src/components/ModifyProductForm.vue" pos="113:9:9" line-data="            &lt;!-- Button to open CategoryOverlay for adding a new category --&gt;">`CategoryOverlay`</SwmToken> component.

```
    /**
     * Closes the CategoryOverlay component.
     */
    closeCategoryOverlay() {
      this.showCategoryOverlay = false;
    },
```

---

</SwmSnippet>

This concludes the walkthrough of the <SwmToken path="/frontend/src/components/ModifyProductForm.vue" pos="4:4:4" line-data="  File: ModifyProductForm.vue">`ModifyProductForm`</SwmToken> feature. The component is located at <SwmPath>[frontend/src/components/ModifyProductForm.vue](/frontend/src/components/ModifyProductForm.vue)</SwmPath>.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBUmV0YWlsSFVCLUZyb250ZW5kJTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="RetailHUB-Frontend"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
