<!--
  =====================================================
  Project: RetailHub
  File: AddProductForm.vue
  Description: Component for adding new products to the RetailHub inventory.
  Participants:
    - Alexandre Borny
    - Maël Castellan
    - Laura Donato
    - Rémi Desjardins
  =====================================================
-->

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

          <div class="form-group">
            <label for="slot">Slot</label>
            <input
                type="text"
                id="slot"
                v-model="product.Slot"
                placeholder="Enter slot"
            />
          </div>
        </div>

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

          <div class="form-group">
            <label for="reorder-level">Reorder Level</label>
            <input
                type="number"
                id="reorder-level"
                v-model="product.Reorder_level"
                placeholder="Enter reorder level"
                required
            />
          </div>
        </div>

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

<script>
/**
 * AddProductForm Component
 * Handles the addition of new products to the RetailHub inventory.
 */

import CategoryOverlay from '@/components/Category.vue';

export default {
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
  created() {
    this.fetchCategories();
  },
  methods: {
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

    /**
     * Validates the product form before submission.
     * @returns {boolean} True if the form is valid, false otherwise.
     */
    validateForm() {
      this.errors = {}; // Clear previous errors

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
  },
  components: {
    CategoryOverlay,
  },
};
</script>

<style scoped>

h2 {
  margin-bottom: 1rem;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.add-product-form {
  background-color: white;
  padding: 1.25rem;
  border-radius: .625rem;
  width: 25rem;
}
.add-product-form {
  background: white;
  padding: 1.25rem;
  border-radius: 1.875rem;
  width: 80%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: gray;
}

.form-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: .938rem;
}

.form-group {
  flex: 1;
  margin-right: .938rem;
}

.form-group:last-child {
  margin-right: 0;
}

.form-group label {
  display: block;
  margin-bottom: .313rem;
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  width: 96%;
  padding: .625rem;
  border: 1px solid black;
  border-radius: 1.563rem;
  font-size: 1rem;
}

#price {
  width: 94%;
}

#overview {
  width: 99.5%;
}

.submit-btn {
  padding: .625rem 1.25rem;
  margin-top: 1rem;
  background-color: #80cbc4;
  color: white;
  border: none;
  border-radius: 1.563rem;
  cursor: pointer;
  font-size: 1rem;
}

.submit-btn:hover {
  background-color: #5d8f8d;
}

.category-label{
  font-weight: bold;
  display: block;
  margin-bottom: .313rem;
}

.category-wrapper {
  display: flex;
  align-items: center;
}

.category-select {
  width: 70%;
  padding: .625rem;
  font-size: 1rem;
  border-radius: 1.563rem;
  border: 1px solid black;
  background-color: white;
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><polygon fill="%23666" points="0,5 10,15 20,5"/></svg>');
  background-repeat: no-repeat;
  background-position: right .625rem center;
  background-size: .938rem;
}

.category-btn {
  padding: .625rem .938rem;
  margin-left: .625rem;
  background-color: #274156;
  color: white;
  border: none;
  border-radius: 1.563rem;
  cursor: pointer;
  font-size: .875rem;
  transition: background-color 0.3s ease;
}

.category-btn:hover {
  background-color: #5d7180;
}

</style>