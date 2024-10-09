---
title: AddProductForm
---
# Introduction

This document will walk you through the implementation of the <SwmToken path="/frontend/src/components/AddProductForm.vue" pos="4:4:4" line-data="  File: AddProductForm.vue">`AddProductForm`</SwmToken> feature.

The feature allows users to add new products through a form interface.

We will cover:

1. The structure and layout of the form.
2. Data handling and state management.
3. Form validation and submission.
4. Category management.

# Structure and layout of the form

The form is structured within a Vue component located at <SwmPath>[frontend/src/components/AddProductForm.vue](/frontend/src/components/AddProductForm.vue)</SwmPath>. The template defines the layout and elements of the form.

<SwmSnippet path="/frontend/src/components/AddProductForm.vue" line="14">

---

The form header includes a title and a close button to exit the form.

```
<template>
  <div class="overlay">
    <div class="add-product-form">
      <!-- Form Header with Title and Close Button -->
      <div class="form-header">
        <h2>Add Product</h2>
        <button @click="$emit('close')" class="close-btn">
          <i class="fa-solid fa-xmark fa-xl"></i>
        </button>
      </div>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/AddProductForm.vue" line="24">

---

The form itself includes fields for product name, SKU, and price.

```

      <!-- Product Addition Form -->
      <form @submit.prevent="addProduct">
        <!-- Product Name, SKU, and Price on the same line -->
        <div class="form-row">
          <div class="form-group">
            <label for="name">Name</label>
            <input
                type="text"
                id="name"
                v-model="product.name"
                placeholder="Enter product name"
                required
            />
          </div>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/AddProductForm.vue" line="63">

---

Additional fields for image URL and slot are included.

```

        <!-- Image URL and Slot Inputs -->
        <div class="form-row">
          <div class="form-group">
            <label for="Image">Image URL</label>
            <input
                type="text"
                id="imageUrl"
                v-model="product.Image"
                placeholder="Enter image URL"
                required
            />
          </div>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/AddProductForm.vue" line="87">

---

Category selection is handled with a dropdown and an option to add new categories.

```

        <!-- Category Selection and Add Category Button -->
        <div class="form-row">
          <div class="form-group category-group">
            <label for="categorySelect" class="category-label">Select Category</label>
            <div class="category-wrapper">
              <select id="categorySelect" class="category-select" v-model="selectedCategory">
                <option
                    v-for="category in categories"
                    :key="category._id"
                    :value="category._id"
                >
                  {{ category.name }}
                </option>
              </select>
              <button type="button" class="category-btn" @click="openCategoryOverlay">
                Add Category
              </button>
            </div>
          </div>
        </div>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/AddProductForm.vue" line="108">

---

Fields for current stock and reorder level are also present.

```

        <!-- Stock and Reorder Level Inputs -->
        <div class="form-row">
          <div class="form-group">
            <label for="current-stock">Current Stock</label>
            <input
                type="number"
                id="current-stock"
                v-model="product.Current_stock"
                placeholder="Enter stock"
                required
            />
          </div>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/AddProductForm.vue" line="133">

---

A text area for product details is included.

```

        <!-- Product Details Text Area -->
        <div class="form-group">
          <label for="overview">Details</label>
          <textarea
              id="overview"
              v-model="product.Details"
              placeholder="Enter product details"
              required
          ></textarea>
        </div>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/AddProductForm.vue" line="144">

---

Finally, a submit button is provided to add the product.

```

        <!-- Submit Button -->
        <button type="submit" class="submit-btn">Add product</button>
      </form>

      <!-- Category Overlay Component -->
      <CategoryOverlay
          :show="showCategoryOverlay"
          :categories="categories"
          @addCategory="addCategory"
          @removeCategory="removeCategory"
          @closeOverlay="closeCategoryOverlay"
      />
    </div>
  </div>
</template>
```

---

</SwmSnippet>

# Data handling and state management

<SwmSnippet path="/frontend/src/components/AddProductForm.vue" line="170">

---

The component's data function initializes the product object and other state variables.

```
  data() {
    return {
      product: {
        name: '',
        category: '',
        SKU: '',
        price: '',
        Current_stock: '',
        Reorder_level: '',
        Details: '',
        Image: '',
        Slot: '',
      },
      showCategoryOverlay: false,
      selectedCategory: '',
      categories: [],
      errors: {}, // Object to hold form validation errors
    };
  },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/AddProductForm.vue" line="189">

---

When the component is created, it fetches the list of categories from the API.

```
  created() {
    this.fetchCategories();
  },
```

---

</SwmSnippet>

<SwmSnippet path="frontend/src/components/AddProductForm.vue" line="193">

---

The <SwmToken path="/frontend/src/components/AddProductForm.vue" pos="196:3:3" line-data="    async fetchCategories() {">`fetchCategories`</SwmToken> method retrieves categories from the server.

```
    /**
     * Fetches the list of categories from the API.
     */
    async fetchCategories() {
      try {
        const response = await fetch('https://com.servhub.fr/api/categories');
        if (response.ok) {
          this.categories = await response.json(); // Assuming the response is an array
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

# Form validation and submission

<SwmSnippet path="/frontend/src/components/AddProductForm.vue" line="209">

---

The <SwmToken path="/frontend/src/components/AddProductForm.vue" pos="213:1:1" line-data="    validateForm() {">`validateForm`</SwmToken> method ensures all required fields are filled and valid before submission.

@returns {boolean} True if the form is valid, false otherwise.

```
    /**
     * Validates the product form before submission.
     * @returns {boolean} True if the form is valid, false otherwise.
     */
    validateForm() {
      this.errors = {}; // Clear previous errors
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/AddProductForm.vue" line="215">

---

It checks for the presence and validity of each field.

```

      // Validate Name
      if (!this.product.name || this.product.name.trim() === '') {
        this.errors.name = 'Product name is required';
      }

      // Validate SKU
      if (!this.product.SKU || this.product.SKU.trim() === '') {
        this.errors.SKU = 'SKU is required';
      }

      // Validate Price
      if (!this.product.price || this.product.price <= 0) {
        this.errors.price = 'Price must be greater than 0';
      }

      // Validate Image URL (optional field)
      if (this.product.Image && !this.isValidUrl(this.product.Image)) {
        this.errors.Image = 'Invalid image URL';
      }

      // Validate Current Stock
      if (
          this.product.Current_stock === '' ||
          this.product.Current_stock === null ||
          this.product.Current_stock < 0
      ) {
        this.errors.Current_stock = 'Current stock must be 0 or more';
      }

      // Validate Reorder Level
      if (
          this.product.Reorder_level === '' ||
          this.product.Reorder_level === null ||
          this.product.Reorder_level < 0
      ) {
        this.errors.Reorder_level = 'Reorder level must be 0 or more';
      }

      // Validate Category
      if (!this.selectedCategory || this.selectedCategory.trim() === '') {
        this.errors.selectedCategory = 'Category is required';
      }

      // Return true if no errors, otherwise false
      return Object.keys(this.errors).length === 0;
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/AddProductForm.vue" line="263">

---

The <SwmToken path="/frontend/src/components/AddProductForm.vue" pos="268:1:1" line-data="    isValidUrl(string) {">`isValidUrl`</SwmToken> method validates the format of the image URL.

@param {string} <SwmToken path="/frontend/src/components/AddProductForm.vue" pos="268:3:3" line-data="    isValidUrl(string) {">`string`</SwmToken> - The string to validate.\
@returns {boolean} True if valid URL, false otherwise.

```
    /**
     * Checks if a given string is a valid URL.
     * @param {string} string - The string to validate.
     * @returns {boolean} True if valid URL, false otherwise.
     */
    isValidUrl(string) {
      try {
        new URL(string);
        return true;
      } catch (_) {
        return false;
      }
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/AddProductForm.vue" line="311">

---

The <SwmToken path="/frontend/src/components/AddProductForm.vue" pos="314:3:3" line-data="    async addProduct() {">`addProduct`</SwmToken> method handles form submission. It validates the form, sets the category, and sends a POST request to add the product.

```
    /**
     * Handles the form submission for adding a new product.
     */
    async addProduct() {
      if (!this.validateForm()) {
        // If validation fails, do not proceed
        return;
      }
      try {
        // Find the selected category object
        const selectedCategoryObj = this.categories.find(
            (cat) => cat._id === this.selectedCategory
        );
        if (selectedCategoryObj) {
          this.product.category = selectedCategoryObj.name; // Set the category name
        }

        // Send POST request to add the product
        const response = await fetch('https://com.servhub.fr/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.product),
        });

        // Check if the request was successful
        if (response.ok) {
          const result = await response.json();
          console.log('Product added successfully:', result);
          alert(`Product "${this.product.name}" added successfully!`);

          // Emit event to close the form
          this.$emit('close');
        } else {
          const result = await response.json();
          console.error('Failed to add product:', result);
          alert(`Failed to add product: ${result.message}`);
        }
      } catch (error) {
        console.error('Error adding product:', error);
        alert('An error occurred while adding the product.');
      }
    },
```

---

</SwmSnippet>

# Category management

<SwmSnippet path="/frontend/src/components/AddProductForm.vue" line="277">

---

The <SwmToken path="/frontend/src/components/AddProductForm.vue" pos="281:1:1" line-data="    addCategory(newCategory) {">`addCategory`</SwmToken> method allows adding new categories to the list.

@param {Object} <SwmToken path="/frontend/src/components/AddProductForm.vue" pos="281:3:3" line-data="    addCategory(newCategory) {">`newCategory`</SwmToken> - The new category to add.

```
    /**
     * Adds a new category to the categories list.
     * @param {Object} newCategory - The new category to add.
     */
    addCategory(newCategory) {
      if (newCategory._id && newCategory.name) {
        this.categories.push(newCategory);
        alert(`Category "${newCategory.name}" added successfully.`);
        // Optionally, set the newly added category as the selected category
        this.selectedCategory = newCategory._id;
      }
    },

```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/AddProductForm.vue" line="290">

---

The <SwmToken path="/frontend/src/components/AddProductForm.vue" pos="294:3:3" line-data="    async removeCategory(category) {">`removeCategory`</SwmToken> method handles the removal of categories.

@param {Object} <SwmToken path="/frontend/src/components/AddProductForm.vue" pos="294:5:5" line-data="    async removeCategory(category) {">`category`</SwmToken> - The category to remove.

```
    /**
     * Removes a category from the categories list.
     * @param {Object} category - The category to remove.
     */
    async removeCategory(category) {
      try {
        const response = await fetch(`https://com.servhub.fr/api/categories/${category._id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          this.categories = this.categories.filter(
              (cat) => cat._id !== category._id
          );
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

<SwmSnippet path="/frontend/src/components/AddProductForm.vue" line="356">

---

The <SwmToken path="/frontend/src/components/AddProductForm.vue" pos="359:1:1" line-data="    openCategoryOverlay() {">`openCategoryOverlay`</SwmToken> and <SwmToken path="/frontend/src/components/AddProductForm.vue" pos="366:1:1" line-data="    closeCategoryOverlay() {">`closeCategoryOverlay`</SwmToken> methods manage the visibility of the category overlay.

```
    /**
     * Opens the category overlay to add a new category.
     */
    openCategoryOverlay() {
      this.showCategoryOverlay = true;
    },

    /**
     * Closes the category overlay.
     */
    closeCategoryOverlay() {
      this.showCategoryOverlay = false;
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/AddProductForm.vue" line="370">

---

The <SwmToken path="/frontend/src/components/AddProductForm.vue" pos="371:1:1" line-data="    CategoryOverlay,">`CategoryOverlay`</SwmToken> component is included to handle category-related actions.

```
  components: {
    CategoryOverlay,
  },
```

---

</SwmSnippet>

This concludes the walkthrough of the <SwmToken path="/frontend/src/components/AddProductForm.vue" pos="4:4:4" line-data="  File: AddProductForm.vue">`AddProductForm`</SwmToken> feature. The implementation ensures a structured form layout, robust data handling, and comprehensive form validation and submission processes.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBUmV0YWlsSFVCLUZyb250ZW5kJTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="RetailHUB-Frontend"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
