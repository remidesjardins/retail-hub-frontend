---
title: Category
---
# Introduction

This document will walk you through the implementation of the <SwmPath>[frontend/src/components/Category.vue](/frontend/src/components/Category.vue)</SwmPath> feature.

The feature allows users to manage categories through a modal overlay. Users can add new categories, view existing ones, and remove them.

We will cover:

1. How the category overlay is structured.
2. How new categories are added.
3. How existing categories are removed.
4. How the overlay is closed.

# Overlay structure

<SwmSnippet path="/frontend/src/components/Category.vue" line="14">

---

The overlay is a modal that appears when the <SwmToken path="/frontend/src/components/Category.vue" pos="16:9:9" line-data="  &lt;div v-if=&quot;show&quot; class=&quot;overlay&quot;&gt;">`show`</SwmToken> prop is true. It contains a form for adding new categories, a list of existing categories, and a button to close the overlay.

```
<template>
  <!-- Overlay to display the category management modal -->
  <div v-if="show" class="overlay">
    <div class="overlay-content">
      <!-- Header for managing categories -->
      <h3>Manage Categories</h3>

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
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/Category.vue" line="31">

---

The list of existing categories is displayed below the form. Each category has a remove button.

```

      <!-- List of existing categories -->
      <h4>Existing Categories</h4>
      <ul>
        <li v-for="category in categories" :key="category._id" class="category-item">
          <span>{{ category.name }}</span>
          <button @click="removeCategory(category)" class="remove-btn">Remove</button>
        </li>
      </ul>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/Category.vue" line="40">

---

The close button allows users to close the overlay.

```

      <!-- Button to close the category overlay -->
      <button @click="closeOverlay" class="close-btn">Close</button>
    </div>
  </div>
</template>
```

---

</SwmSnippet>

# Props and data

<SwmSnippet path="/frontend/src/components/Category.vue" line="53">

---

The component uses props to control its visibility and to pass the list of existing categories. The <SwmToken path="/frontend/src/components/Category.vue" pos="57:1:1" line-data="    show: {">`show`</SwmToken> prop is a boolean that controls the visibility of the overlay. The <SwmToken path="/frontend/src/components/Category.vue" pos="62:9:9" line-data="     * List of existing categories.">`categories`</SwmToken> prop is an array that holds the existing categories.

```
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
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/Category.vue" line="69">

---

The <SwmToken path="/frontend/src/components/Category.vue" pos="74:1:1" line-data="      newCategory: &quot;&quot;,">`newCategory`</SwmToken> data property holds the name of the new category to be added.

```
  data() {
    return {
      /**
       * Holds the name of the new category to be added.
       */
      newCategory: "",
    };
  },
```

---

</SwmSnippet>

# Adding a new category

<SwmSnippet path="/frontend/src/components/Category.vue" line="78">

---

The <SwmToken path="/frontend/src/components/Category.vue" pos="82:3:3" line-data="    async addCategory() {">`addCategory`</SwmToken> method handles adding a new category. It sends a POST request to the API with the new category name. If the request is successful, it emits the new category to the parent component and updates the local list of categories.

```
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
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: this.newCategory }),
          });
          if (response.ok) {
            const createdCategory = await response.json();
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/Category.vue" line="94">

---

The method ensures the created category has the correct fields before emitting it and updating the local list.

```

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
```

---

</SwmSnippet>

# Removing an existing category

<SwmSnippet path="/frontend/src/components/Category.vue" line="114">

---

The <SwmToken path="/frontend/src/components/Category.vue" pos="118:1:1" line-data="    removeCategory(category) {">`removeCategory`</SwmToken> method handles removing an existing category. It emits the category to be removed to the parent component.

@param {Object} <SwmToken path="/frontend/src/components/Category.vue" pos="118:3:3" line-data="    removeCategory(category) {">`category`</SwmToken> - The category object to be removed.

```
    /**
     * Removes an existing category by emitting an event to the parent component.
     * @param {Object} category - The category object to be removed.
     */
    removeCategory(category) {
      console.log("Category to delete:", category);
      this.$emit("removeCategory", category);
    },
```

---

</SwmSnippet>

# Closing the overlay

<SwmSnippet path="/frontend/src/components/Category.vue" line="123">

---

The <SwmToken path="/frontend/src/components/Category.vue" pos="126:1:1" line-data="    closeOverlay() {">`closeOverlay`</SwmToken> method handles closing the overlay. It emits a close event to the parent component.

```
    /**
     * Closes the category overlay by emitting a close event to the parent component.
     */
    closeOverlay() {
      this.$emit("closeOverlay");
    },
```

---

</SwmSnippet>

# Conclusion

This document explained the structure and functionality of the Category feature. The overlay allows users to manage categories by adding new ones, viewing existing ones, and removing them. The component uses props and data properties to manage its state and interactions.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBUmV0YWlsSFVCLUZyb250ZW5kJTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="RetailHUB-Frontend"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
