---
title: ReceiptParcelForm
---
# Introduction

This document will walk you through the implementation of the <SwmToken path="/frontend/src/components/ReceiptParcelForm.vue" pos="4:4:4" line-data="  File: ReceiptParcelForm.vue">`ReceiptParcelForm`</SwmToken> component.

The component handles the receipt of a parcel by updating the stock level of a product.

We will cover:

1. Why we need an overlay and form structure.
2. How we handle user input for SKU and received amount.
3. The process of submitting the form and updating the stock level.
4. The importance of form validation and error handling.
5. Resetting the form after submission.

# Overlay and form structure

<SwmSnippet path="/frontend/src/components/ReceiptParcelForm.vue" line="14">

---

The component uses an overlay to focus the user's attention on the form for receiving a parcel. The form includes a header with a title and a close button.

```
<template>
  <!-- Overlay container to focus on the Receipt Parcel form -->
  <div class="overlay">
    <!-- Form container for receiving a parcel -->
    <div class="receipt-parcel-form">
      <!-- Form header with title and close button -->
      <div class="form-header">
        <h2>Receipt of a Parcel</h2>
        <button @click="$emit('close')" class="close-btn">
          <i class="fa-solid fa-xmark fa-xl"></i>
        </button>
      </div>
```

---

</SwmSnippet>

# User input for SKU and received amount

<SwmSnippet path="/frontend/src/components/ReceiptParcelForm.vue" line="26">

---

The form captures the SKU code and the number of products received. These inputs are essential for identifying the product and updating its stock level.

```

      <!-- Form for submitting parcel receipt details -->
      <form @submit.prevent="handleReceipt">
        <!-- Row for SKU Code input -->
        <div class="form-row">
          <div class="form-group">
            <label for="sku">SKU Code</label>
            <input
                type="text"
                id="sku"
                v-model="parcel.SKU"
                placeholder="Enter SKU code"
                required
            />
          </div>
        </div>

        <!-- Row for Number of Products Received input -->
        <div class="form-row">
          <div class="form-group">
            <label for="received-amount">No. of Products Received</label>
            <input
                type="number"
                id="received-amount"
                v-model="parcel.receivedAmount"
                placeholder="Enter the quantity received"
                required
                min="1"
            />
          </div>
        </div>
```

---

</SwmSnippet>

# Form submission and stock update

<SwmSnippet path="/frontend/src/components/ReceiptParcelForm.vue" line="86">

---

The <SwmToken path="/frontend/src/components/ReceiptParcelForm.vue" pos="90:3:3" line-data="    async handleReceipt() {">`handleReceipt`</SwmToken> method is triggered upon form submission. It validates the inputs, fetches the current stock level, calculates the new stock level, and updates the backend.

```
    /**
     * Handles the form submission to update the product's stock level.
     * Validates inputs, fetches current stock, calculates new stock, and updates the backend.
     */
    async handleReceipt() {
      // Validate that both SKU and receivedAmount are provided
      if (!this.parcel.SKU || !this.parcel.receivedAmount) {
        window.alert("Please enter both SKU and the received amount.");
        return;
      }
```

---

</SwmSnippet>

# Fetching current stock level

<SwmSnippet path="/frontend/src/components/ReceiptParcelForm.vue" line="96">

---

We fetch the current stock level from the backend using the SKU provided by the user. This ensures we have the latest stock information before updating it.

```

      try {
        // Fetch the current stock level from the backend using the SKU
        const response = await fetch(`https://com.servhub.fr/api/products/${this.parcel.SKU}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
```

---

</SwmSnippet>

# Validating product data

<SwmSnippet path="/frontend/src/components/ReceiptParcelForm.vue" line="105">

---

We check if the product exists and if it has a <SwmToken path="/frontend/src/components/ReceiptParcelForm.vue" pos="115:13:13" line-data="        // Ensure the product has a Current_stock field">`Current_stock`</SwmToken> field. This validation step is crucial to avoid updating non-existent or incomplete product data.

```

        // Check if the product exists
        if (!response.ok) {
          const errorData = await response.json();
          window.alert(`Error fetching product: ${errorData.message}`);
          return;
        }

        const product = await response.json();

        // Ensure the product has a Current_stock field
        if (typeof product.Current_stock === 'undefined') {
          window.alert("Product data is incomplete. Cannot update stock level.");
          return;
        }
```

---

</SwmSnippet>

# Calculating new stock level

<SwmSnippet path="/frontend/src/components/ReceiptParcelForm.vue" line="120">

---

We calculate the new stock level by adding the received amount to the current stock. This step ensures the stock level is accurately updated.

```

        // Calculate the new stock level by adding the received amount
        const receivedAmount = parseInt(this.parcel.receivedAmount, 10);
        if (isNaN(receivedAmount) || receivedAmount < 1) {
          window.alert("Received amount must be a positive integer.");
          return;
        }

        const newStockLevel = parseInt(product.Current_stock, 10) + receivedAmount;

        // Prepare the data for updating the stock level
        const placementData = {
          Current_stock: newStockLevel,
        };
```

---

</SwmSnippet>

# Updating the backend

<SwmSnippet path="/frontend/src/components/ReceiptParcelForm.vue" line="134">

---

We send a PUT request to update the stock level in the backend. This step finalizes the stock update process.

```

        // Send a PUT request to update the stock level in the backend
        const updateResponse = await fetch(`https://com.servhub.fr/api/products/${this.parcel.SKU}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(placementData),
        });
```

---

</SwmSnippet>

# Handling update response

<SwmSnippet path="/frontend/src/components/ReceiptParcelForm.vue" line="143">

---

We handle the response from the update request to confirm the stock update or display an error message if the update fails.

```

        // Handle the response from the update request
        if (updateResponse.ok) {
          const result = await updateResponse.json();
          window.alert(`Stock updated successfully. New stock level: ${newStockLevel}`);
          console.log('Product placement response:', result);
          this.$emit('close'); // Close the form after successful submission
          this.resetForm(); // Reset the form fields
        } else {
          const errorData = await updateResponse.json();
          window.alert(`Error updating stock level: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error during product placement:', error);
        window.alert('An error occurred while placing the product.');
      }
    },
```

---

</SwmSnippet>

# Resetting the form

<SwmSnippet path="/frontend/src/components/ReceiptParcelForm.vue" line="161">

---

After a successful submission, we reset the form fields to their initial state. This prepares the form for the next input.

```
    /**
     * Resets the form fields to their initial state.
     */
    resetForm() {
      this.parcel.SKU = '';
      this.parcel.receivedAmount = '';
    },
```

---

</SwmSnippet>

# Data structure

<SwmSnippet path="/frontend/src/components/ReceiptParcelForm.vue" line="71">

---

The component uses a <SwmToken path="/frontend/src/components/ReceiptParcelForm.vue" pos="74:9:9" line-data="       * Object holding the parcel receipt details entered by the user.">`parcel`</SwmToken> object to hold the receipt details entered by the user. This object includes the SKU and the received amount.

```
  data() {
    return {
      /**
       * Object holding the parcel receipt details entered by the user.
       * @type {Object}
       * @property {string} SKU - The Stock Keeping Unit code of the product.
       * @property {number} receivedAmount - The number of products received in the parcel.
       */
      parcel: {
        SKU: '',
        receivedAmount: '',
      },
    };
  },
```

---

</SwmSnippet>

This concludes the walkthrough of the <SwmToken path="/frontend/src/components/ReceiptParcelForm.vue" pos="4:4:4" line-data="  File: ReceiptParcelForm.vue">`ReceiptParcelForm`</SwmToken> component. The implementation ensures accurate stock updates and provides a user-friendly interface for receiving parcels.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBUmV0YWlsSFVCLUZyb250ZW5kJTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="RetailHUB-Frontend"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
