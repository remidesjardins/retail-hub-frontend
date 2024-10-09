---
title: PlaceProductForm
---
# Introduction

This document will walk you through the implementation of the <SwmToken path="/frontend/src/components/PlaceProductForm.vue" pos="4:4:4" line-data="  File: PlaceProductForm.vue">`PlaceProductForm`</SwmToken> component in the <SwmToken path="/frontend/src/components/PlaceProductForm.vue" pos="3:4:4" line-data="  Project: RetailHub">`RetailHub`</SwmToken> project.

The <SwmToken path="/frontend/src/components/PlaceProductForm.vue" pos="4:4:4" line-data="  File: PlaceProductForm.vue">`PlaceProductForm`</SwmToken> component allows users to assign a product to a specific slot within <SwmToken path="/frontend/src/components/PlaceProductForm.vue" pos="3:4:4" line-data="  Project: RetailHub">`RetailHub`</SwmToken>. We will cover:

1. The structure of the form.
2. The data model used for the form.
3. The form submission process and API interaction.

The component is located at: <SwmPath>[frontend/src/components/PlaceProductForm.vue](/frontend/src/components/PlaceProductForm.vue)</SwmPath>

# Form structure

The form is designed to capture the SKU code and slot code for a product. It includes a header, input fields, and a submit button.

<SwmSnippet path="/frontend/src/components/PlaceProductForm.vue" line="14">

---

The overlay container and form header are defined to focus user attention on the form and provide a way to close it.

```
<template>
  <!-- Overlay container to focus on the Place Product form -->
  <div class="overlay">
    <!-- Form container for placing a product -->
    <div class="place-product-form">
      <!-- Form header with title and close button -->
      <div class="form-header">
        <h2>Place Product</h2>
        <button @click="$emit('close')" class="close-btn">
          <i class="fa-solid fa-xmark fa-xl"></i>
        </button>
      </div>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/PlaceProductForm.vue" line="26">

---

The form captures the SKU code and slot code from the user. These fields are required for placing the product.

```

      <!-- Form for placing the product -->
      <form @submit.prevent="placeProduct">
        <!-- Row for SKU Code input -->
        <div class="form-row">
          <div class="form-group">
            <label for="sku">SKU Code</label>
            <input
                type="text"
                id="sku"
                v-model="placement.SKU"
                placeholder="Enter SKU Code"
                required
            />
          </div>
        </div>

        <!-- Row for Slot Code input -->
        <div class="form-row">
          <div class="form-group">
            <label for="slotCode">Slot Code</label>
            <input
                type="text"
                id="slotCode"
                v-model="placement.slotCode"
                placeholder="Enter Slot Code"
                required
            />
          </div>
        </div>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/PlaceProductForm.vue" line="56">

---

The submit button triggers the form submission process.

```

        <!-- Submit button to place the product -->
        <button type="submit" class="submit-btn">Place Product</button>
      </form>
    </div>
  </div>
</template>
```

---

</SwmSnippet>

# Data model

<SwmSnippet path="/frontend/src/components/PlaceProductForm.vue" line="70">

---

The component uses a data object to hold the placement details entered by the user. This object includes the SKU and slot code.

```
  data() {
    return {
      /**
       * Object holding the placement details entered by the user.
       * @type {Object}
       * @property {string} SKU - The Stock Keeping Unit code of the product.
       * @property {string} slotCode - The code of the slot where the product will be placed.
       */
      placement: {
        SKU: '',
        slotCode: '',
      },
    };
  },
```

---

</SwmSnippet>

# Form submission process

The <SwmToken path="/frontend/src/components/PlaceProductForm.vue" pos="28:10:10" line-data="      &lt;form @submit.prevent=&quot;placeProduct&quot;&gt;">`placeProduct`</SwmToken> method handles the form submission. It validates the input fields, sends a PUT request to update the product's slot, and provides user feedback based on the API response.

<SwmSnippet path="/frontend/src/components/PlaceProductForm.vue" line="85">

---

The method first checks if both SKU and slot code are provided.

```
    /**
     * Handles the form submission to place the product.
     * Validates input fields, sends a PUT request to update the product's slot,
     * and provides user feedback based on the API response.
     */
    async placeProduct() {
      // Validate that both SKU and Slot Code are provided
      if (!this.placement.SKU || !this.placement.slotCode) {
        window.alert("Please fill in both SKU Code and Slot Code.");
        return;
      }
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/PlaceProductForm.vue" line="96">

---

It then prepares the data for the API call.

```

      try {
        // Prepare the data for placing the product
        const placementData = {
          SKU: this.placement.SKU.trim(),
          Slot: this.placement.slotCode.trim(),
        };
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/PlaceProductForm.vue" line="103">

---

The API call updates the slot code for the product.

```

        // Make the API call to update the Slot Code for the product
        const response = await fetch(`https://com.servhub.fr/api/products/${this.placement.SKU}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(placementData),
        });
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/PlaceProductForm.vue" line="112">

---

Finally, the method handles the server response, providing feedback to the user and closing the form if the submission is successful.

```

        // Handle the response from the server
        if (response.ok) {
          const result = await response.json();
          window.alert(`Product placed successfully with Slot Code: ${this.placement.slotCode}`);
          console.log('Product placement response:', result);
          this.$emit('close'); // Close the form after successful submission
        } else {
          const errorData = await response.json();
          window.alert(`Error placing product: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error during product placement:', error);
        window.alert('An error occurred while placing the product.');
      }
    },
```

---

</SwmSnippet>

This concludes the walkthrough of the <SwmToken path="/frontend/src/components/PlaceProductForm.vue" pos="4:4:4" line-data="  File: PlaceProductForm.vue">`PlaceProductForm`</SwmToken> component. The implementation ensures that users can efficiently place products into specific slots within <SwmToken path="/frontend/src/components/PlaceProductForm.vue" pos="3:4:4" line-data="  Project: RetailHub">`RetailHub`</SwmToken>.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBUmV0YWlsSFVCLUZyb250ZW5kJTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="RetailHUB-Frontend"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
