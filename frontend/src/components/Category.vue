<!--
  =====================================================
  Project: RetailHub
  File: Category.vue
  Description: Component for managing categories within RetailHub.
  Participants:
    - Alexandre Borny
    - Maël Castellan
    - Laura Donato
    - Rémi Desjardins
  =====================================================
-->

<template>
  <!-- Overlay to display the category management modal -->
  <div v-if="show" class="overlay">
    <div class="overlay-content">
      <!-- Header for managing categories -->
      <div class="form-header">
        <h3>Manage Categories</h3>
        <button @click="closeOverlay" class="close-btn">
          <i class="fa-solid fa-xmark fa-xl"></i>
        </button>
      </div>

      <!-- Form to add a new category -->
      <form @submit.prevent="addCategory">
        <input
            v-model="newCategory"
            type="text"
            placeholder="Enter new category"
            class="input-field"
        />
        <button type="submit" class="submit-btn">Add Category</button>
      </form>

      <!-- List of existing categories -->
      <h4>Existing Categories</h4>
      <ul>
        <li v-for="category in categories" :key="category._id" class="category-item">
          <span>{{ category.name }}</span>
          <button @click="removeCategory(category)" class="remove-btn">Remove</button>
        </li>
      </ul>

    </div>
  </div>
</template>

<script>
/**
 * Category Component
 * Manages the addition and removal of product categories in RetailHub.
 */
export default {
  props: {
    /**
     * Controls the visibility of the category overlay.
     */
    show: {
      type: Boolean,
      default: false,
    },
    /**
     * List of existing categories.
     */
    categories: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      /**
       * Holds the name of the new category to be added.
       */
      newCategory: "",
    };
  },
  methods: {
    /**
     * Adds a new category by sending a POST request to the API.
     * Emits the new category to the parent component upon successful addition.
     */
    async addCategory() {
      if (this.newCategory.trim() !== "") {
        try {
          const response = await fetch('https://com.servhub.fr/api/categories', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: this.newCategory }),
          });
          if (response.ok) {
            const createdCategory = await response.json();

            // Ensure the createdCategory has the correct fields (_id and name)
            if (createdCategory._id && createdCategory.name) {
              // Emit new category to parent (AddProductForm)
              this.$emit("addCategory", createdCategory);

              // Add the new category to the local array to update the overlay
              this.categories.push(createdCategory);
              // Clear the input field
              this.newCategory = "";
            }
          } else {
            console.error("Failed to add category");
          }
        } catch (error) {
          console.error("Error adding category:", error);
        }
      }
    },

    /**
     * Removes an existing category by emitting an event to the parent component.
     * @param {Object} category - The category object to be removed.
     */
    removeCategory(category) {
      console.log("Category to delete:", category);
      this.$emit("removeCategory", category);
    },

    /**
     * Closes the category overlay by emitting a close event to the parent component.
     */
    closeOverlay() {
      this.$emit("closeOverlay");
    },
  },
};
</script>


<style scoped>

h3 {
  margin-bottom: 1rem;
}

h4 {
  margin: 0.5rem 0;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.overlay-content {
  background: white;
  padding: 1.25rem;
  border-radius: 1.25rem;
  width: 25rem;
  max-width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-height: 100%;
  display: flex;
  flex-direction: column;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-field {
  width: 100%;
  padding: .625rem;
  border: 1px solid #ccc;
  border-radius: 1.563rem;
  font-size: 1rem;
}

ul{
  padding-left: 0;
  margin-top: .625rem;
  max-height: 50vh; /* Set a fixed height for the category list */
  overflow-y: auto;
}

li {
  list-style: none;
  margin-bottom: .625rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .5rem .625rem;
  background: #f9f9f9;
  border-radius: .625rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.submit-btn,
.remove-btn {
  margin-top: .625rem;
  padding: .625rem;
  border: none;
  color: white;
  border-radius: 1.563rem;
  cursor: pointer;
  font-size: .875rem;
  transition: background-color 0.3s ease;
}

.submit-btn, .remove-btn {
  margin-bottom: .625rem;
  background-color: #274156;
}

.submit-btn:hover {
  background-color: #5d7180;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: gray;
}

.remove-btn {
  background-color: darkgray;
  margin-left: auto;
}

.remove-btn:hover {
  background-color: #e53935;
}

ul {
  padding-left: 0;
  margin-top: .625rem;
}

li {
  list-style: none;
  margin-bottom: .625rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .5rem .625rem;
  background: #f9f9f9;
  border-radius: .625rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-item span {
  flex-grow: 1;
  font-size: 1rem;
  padding-right: .625rem;
}
</style>