---
title: UpdateSaleForm
---
# Introduction

This document will walk you through the implementation of the <SwmToken path="/frontend/src/components/UpdateSaleForm.vue" pos="2:7:7" line-data=" * RetailHub - UpdateSaleForm.vue">`UpdateSaleForm`</SwmToken> component located at <SwmPath>[frontend/src/components/UpdateSaleForm.vue](/frontend/src/components/UpdateSaleForm.vue)</SwmPath>.

The <SwmToken path="/frontend/src/components/UpdateSaleForm.vue" pos="2:7:7" line-data=" * RetailHub - UpdateSaleForm.vue">`UpdateSaleForm`</SwmToken> component allows users to update an existing sale's information, including customer details, total price, reference, and payment status.

We will cover:

1. The structure of the form and its fields.
2. Handling form submission and server communication.
3. Managing the visibility of overlays for updating client details.
4. Prop and data definitions.

# Form structure and fields

<SwmSnippet path="/frontend/src/components/UpdateSaleForm.vue" line="14">

---

The form is displayed within an overlay when the <SwmToken path="/frontend/src/components/UpdateSaleForm.vue" pos="15:9:9" line-data="  &lt;div v-if=&quot;show&quot; class=&quot;overlay&quot;&gt;">`show`</SwmToken> prop is true. It includes fields for customer name, total price, reference, and payment status.

```
<template>
  <div v-if="show" class="overlay">
    <div class="overlay-content">
      <h2>Update Sale</h2>

      <!-- Form to update sale details -->
      <form @submit.prevent="updateSale">
        <!-- Customer Name -->
        <div class="form-group customer-row">
          <label for="customer_name">Customer Name</label>
          <!-- Display Customer Name and Modify Button on the same row -->
          <div class="customer-info">
            <p class="customer-name">{{ sale.customer?.name || 'Unknown Customer' }}</p>
            <button type="button" class="modify-client-btn" @click="openClientOverlay">Modify Customer</button>
          </div>
        </div>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/UpdateSaleForm.vue" line="30">

---

The total price field allows users to input the sale's total price.

```

        <!-- Total Price -->
        <div class="form-group">
          <label for="total_price">Total Price</label>
          <input
              type="number"
              step="0.01"
              id="total_price"
              v-model="sale.total_price"
              placeholder="Enter total price"
              required
          />
        </div>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/UpdateSaleForm.vue" line="43">

---

The reference field is for entering the sale's reference.

```

        <!-- Sale Reference -->
        <div class="form-group">
          <label for="reference">Reference</label>
          <input
              type="text"
              id="reference"
              v-model="sale.reference"
              placeholder="Enter reference"
              required
          />
        </div>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/UpdateSaleForm.vue" line="55">

---

The payment status field provides options to select the current payment status of the sale.

```

        <!-- Payment Status -->
        <div class="form-group">
          <label for="payment_status">Payment Status</label>
          <select id="payment_status" v-model="sale.payment_status" required>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/UpdateSaleForm.vue" line="65">

---

The form includes submit and close buttons to handle form submission and closing the overlay.

```

        <!-- Submit and Close Buttons -->
        <div class="button-group">
          <button type="submit" class="submit-btn">Update Sale</button>
          <button type="button" class="close-btn" @click="closeOverlay">Close</button>
        </div>
      </form>
    </div>
  </div>
  <!-- UpdateClient component to modify customer details -->
  <UpdateClient
      v-if="showClientOverlay"
      :client="sale.customer"
      @close="closeClientOverlay"
      @close-data="updateClientData"
  />
</template>
```

---

</SwmSnippet>

# Handling form submission

<SwmSnippet path="/frontend/src/components/UpdateSaleForm.vue" line="117">

---

The <SwmToken path="/frontend/src/components/UpdateSaleForm.vue" pos="121:3:3" line-data="    async updateSale() {">`updateSale`</SwmToken> method sends an update request to the server with the modified sale information. It handles the response and potential errors.

```
    /**
     * Sends an update request to the server with the modified sale information.
     * Handles the response and potential errors.
     */
    async updateSale() {
      try {
        const response = await fetch(`https://com.servhub.fr/api/sales/${this.sale._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(this.sale)
        });
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/UpdateSaleForm.vue" line="130">

---

If the response is successful, the updated sale data is emitted to the parent component, and the overlay is closed.

```

        if (response.ok) {
          const updatedSale = await response.json();
          this.$emit("updateSale", updatedSale);
          alert(`Sale "${this.sale.reference}" updated successfully!`);
          this.closeOverlay();
        } else {
          const errorData = await response.json();
          alert(`Error updating sale: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error updating sale:", error);
        alert("An error occurred while updating the sale.");
      }
    },
```

---

</SwmSnippet>

# Managing overlays for client details

<SwmSnippet path="/frontend/src/components/UpdateSaleForm.vue" line="87">

---

The <SwmToken path="/frontend/src/components/UpdateSaleForm.vue" pos="87:6:6" line-data="  components: { UpdateClient },">`UpdateClient`</SwmToken> component is used to modify customer details. It is displayed when <SwmToken path="/frontend/src/components/UpdateSaleForm.vue" pos="76:6:6" line-data="      v-if=&quot;showClientOverlay&quot;">`showClientOverlay`</SwmToken> is true.

```
  components: { UpdateClient },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/UpdateSaleForm.vue" line="146">

---

The <SwmToken path="/frontend/src/components/UpdateSaleForm.vue" pos="149:1:1" line-data="    openClientOverlay() {">`openClientOverlay`</SwmToken> method sets <SwmToken path="/frontend/src/components/UpdateSaleForm.vue" pos="150:3:3" line-data="      this.showClientOverlay = true;">`showClientOverlay`</SwmToken> to true, displaying the client modification overlay.

```
    /**
     * Opens the client modification overlay.
     */
    openClientOverlay() {
      this.showClientOverlay = true;
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/UpdateSaleForm.vue" line="153">

---

The <SwmToken path="/frontend/src/components/UpdateSaleForm.vue" pos="156:1:1" line-data="    closeClientOverlay() {">`closeClientOverlay`</SwmToken> method sets <SwmToken path="/frontend/src/components/UpdateSaleForm.vue" pos="157:3:3" line-data="      this.showClientOverlay = false;">`showClientOverlay`</SwmToken> to false, hiding the client modification overlay.

```
    /**
     * Closes the client modification overlay.
     */
    closeClientOverlay() {
      this.showClientOverlay = false;
    },
```

---

</SwmSnippet>

<SwmSnippet path="frontend/src/components/UpdateSaleForm.vue" line="160">

---

The <SwmToken path="/frontend/src/components/UpdateSaleForm.vue" pos="165:1:1" line-data="    updateClientData(updatedClient) {">`updateClientData`</SwmToken> method updates the sale's customer data with the modified client information and closes the client overlay.

@param {Object} <SwmToken path="/frontend/src/components/UpdateSaleForm.vue" pos="165:3:3" line-data="    updateClientData(updatedClient) {">`updatedClient`</SwmToken> - The updated client data.

```
    /**
     * Updates the sale's customer data with the modified client information.
     *
     * @param {Object} updatedClient - The updated client data.
     */
    updateClientData(updatedClient) {
      this.sale.customer = updatedClient;
      this.closeClientOverlay();
    },
```

---

</SwmSnippet>

# Prop and data definitions

<SwmSnippet path="/frontend/src/components/UpdateSaleForm.vue" line="89">

---

The <SwmToken path="/frontend/src/components/UpdateSaleForm.vue" pos="91:5:5" line-data="     * The sale object containing current sale information.">`sale`</SwmToken> prop contains the current sale information and is required for the component to function correctly. The <SwmToken path="/frontend/src/components/UpdateSaleForm.vue" pos="101:1:1" line-data="    show: {">`show`</SwmToken> prop determines whether the update sale overlay is visible.

```
  props: {
    /**
     * The sale object containing current sale information.
     * This prop is required for the component to function correctly.
     */
    sale: {
      type: Object,
      required: true
    },
    /**
     * Determines whether the update sale overlay is visible.
     */
    show: {
      type: Boolean,
      default: false
    }
  },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/UpdateSaleForm.vue" line="107">

---

The <SwmToken path="/frontend/src/components/UpdateSaleForm.vue" pos="112:1:1" line-data="      showClientOverlay: false">`showClientOverlay`</SwmToken> data property controls the visibility of the <SwmToken path="/frontend/src/components/UpdateSaleForm.vue" pos="110:13:13" line-data="       * Controls the visibility of the UpdateClient overlay.">`UpdateClient`</SwmToken> overlay.

```
  data() {
    return {
      /**
       * Controls the visibility of the UpdateClient overlay.
       */
      showClientOverlay: false
    };
  },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/UpdateSaleForm.vue" line="170">

---

The <SwmToken path="/frontend/src/components/UpdateSaleForm.vue" pos="173:1:1" line-data="    closeOverlay() {">`closeOverlay`</SwmToken> method emits an event to close the sale update overlay.

```
    /**
     * Closes the sale update overlay.
     */
    closeOverlay() {
      this.$emit("closeOverlay");
    }
```

---

</SwmSnippet>

This concludes the walkthrough of the <SwmToken path="/frontend/src/components/UpdateSaleForm.vue" pos="2:7:7" line-data=" * RetailHub - UpdateSaleForm.vue">`UpdateSaleForm`</SwmToken> component. The implementation ensures that users can update sale information efficiently while managing the visibility of overlays for modifying client details.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBUmV0YWlsSFVCLUZyb250ZW5kJTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="RetailHUB-Frontend"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
