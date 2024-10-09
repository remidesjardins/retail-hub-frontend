---
title: StockCorrection
---
# Introduction

This document will walk you through the implementation of the <SwmToken path="/frontend/src/components/StockCorrection.vue" pos="2:7:7" line-data=" * RetailHub - StockCorrection.vue">`StockCorrection`</SwmToken> feature.

The feature allows users to correct the stock of a product by providing an SKU code and an adjustment number.

We will cover:

1. Why the form structure was chosen.
2. How the data is managed within the component.
3. The process of correcting the stock via API calls.

# Component overview

The <SwmToken path="/frontend/src/components/StockCorrection.vue" pos="2:7:7" line-data=" * RetailHub - StockCorrection.vue">`StockCorrection`</SwmToken> component is located at: <SwmPath>[frontend/src/components/StockCorrection.vue](/frontend/src/components/StockCorrection.vue)</SwmPath>

This component provides a form for correcting the stock of a product by adjusting its current stock based on the provided SKU code and adjustment number.

# Form structure

The form is designed to be simple and user-friendly. It includes fields for the SKU code and the adjustment number, and a submit button to trigger the stock correction.

<SwmSnippet path="/frontend/src/components/StockCorrection.vue" line="14">

---

The form is wrapped in a template with an overlay and a close button to enhance user experience.

```
<template>
  <div class="overlay">
    <div class="stock-correction-form">
      <div class="form-header">
        <h2>Stock Correction</h2>
        <!-- Button to close the stock correction overlay -->
        <button @click="$emit('close')" class="close-btn">
          <i class="fa-solid fa-xmark fa-xl"></i>
        </button>
      </div>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/StockCorrection.vue" line="24">

---

The form itself is defined with a submit handler that prevents the default form submission and instead calls the <SwmToken path="/frontend/src/components/StockCorrection.vue" pos="26:10:10" line-data="      &lt;form @submit.prevent=&quot;correctStock&quot;&gt;">`correctStock`</SwmToken> method.

```

      <!-- Form to submit stock correction -->
      <form @submit.prevent="correctStock">
        <!-- SKU Code Input -->
        <div class="form-row">
          <div class="form-group">
            <label for="sku">SKU Code</label>
            <input
                type="text"
                id="sku"
                v-model="correction.SKU"
                placeholder="Enter SKU Code"
                required
            />
          </div>
        </div>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/StockCorrection.vue" line="40">

---

The SKU code input field is bound to the <SwmToken path="/frontend/src/components/StockCorrection.vue" pos="34:6:8" line-data="                v-model=&quot;correction.SKU&quot;">`correction.SKU`</SwmToken> data property.

```

        <!-- Stock Adjustment Input -->
        <div class="form-row">
          <div class="form-group">
            <label for="adjustment">Adjustment Number</label>
            <input
                type="number"
                id="adjustment"
                v-model="correction.adjustment"
                placeholder="Stock Adjustment"
                required
            />
          </div>
        </div>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/StockCorrection.vue" line="54">

---

The stock adjustment input field is bound to the <SwmToken path="/frontend/src/components/StockCorrection.vue" pos="48:6:8" line-data="                v-model=&quot;correction.adjustment&quot;">`correction.adjustment`</SwmToken> data property.

```

        <!-- Submit Button -->
        <button type="submit" class="submit-btn">Correct Product</button>
      </form>
    </div>
  </div>
</template>
```

---

</SwmSnippet>

# Data management

<SwmSnippet path="/frontend/src/components/StockCorrection.vue" line="64">

---

The component uses a <SwmToken path="/frontend/src/components/StockCorrection.vue" pos="64:1:1" line-data="  data() {">`data`</SwmToken> function to manage the state of the form inputs. The <SwmToken path="/frontend/src/components/StockCorrection.vue" pos="67:9:9" line-data="       * Holds the stock correction details entered by the user.">`correction`</SwmToken> object holds the SKU and adjustment values entered by the user.

```
  data() {
    return {
      /**
       * Holds the stock correction details entered by the user.
       * @property {string} SKU - The Stock Keeping Unit code of the product.
       * @property {number} adjustment - The number to adjust the current stock by.
       */
      correction: {
        SKU: '',
        adjustment: ''
      }
    };
  },
```

---

</SwmSnippet>

# Stock correction process

The <SwmToken path="/frontend/src/components/StockCorrection.vue" pos="26:10:10" line-data="      &lt;form @submit.prevent=&quot;correctStock&quot;&gt;">`correctStock`</SwmToken> method is responsible for validating the input, fetching the current stock, applying the adjustment, and updating the stock on the server.

<SwmSnippet path="/frontend/src/components/StockCorrection.vue" line="79">

---

First, it checks if both SKU and adjustment values are provided.

```
    /**
     * Corrects the stock of a product based on the provided SKU and adjustment number.
     * It fetches the current stock, applies the adjustment, and updates the stock on the server.
     */
    async correctStock() {
      // Validate that both SKU and adjustment are provided
      if (!this.correction.SKU || !this.correction.adjustment) {
        alert("Please fill in both SKU Code and Stock Adjustment.");
        return;
      }
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/StockCorrection.vue" line="89">

---

Then, it fetches the current product details using the provided SKU.

```

      try {
        // Fetch the current product details using the SKU
        const response = await fetch(`https://com.servhub.fr/api/products/${this.correction.SKU}`);
        if (!response.ok) {
          alert(`Error fetching product with SKU: ${this.correction.SKU}`);
          return;
        }
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/StockCorrection.vue" line="97">

---

Next, it prepares the data payload for the stock correction.

```

        const product = await response.json();

        // Prepare the data payload for the stock correction
        const stockCorrectionData = {
          SKU: this.correction.SKU,
          Current_stock: this.correction.adjustment,
        };
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/StockCorrection.vue" line="105">

---

A PUT request is sent to update the product's stock on the server.

```

        // Send a PUT request to update the product's stock on the server
        const updateResponse = await fetch(`https://com.servhub.fr/api/products/${this.correction.SKU}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(stockCorrectionData),
        });
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/StockCorrection.vue" line="114">

---

Finally, the server's response is handled to provide feedback to the user and close the overlay if the correction is successful.

```

        // Handle the server's response
        if (updateResponse.ok) {
          const result = await updateResponse.json();
          alert(`Stock corrected successfully for SKU: ${this.correction.SKU}`);
          console.log('Stock correction response:', result);
          this.$emit('close');  // Close the overlay after successful correction
        } else {
          const errorData = await updateResponse.json();
          alert(`Error correcting stock: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error during stock correction:', error);
        alert('An error occurred while correcting the stock.');
      }
    }
  }
```

---

</SwmSnippet>

This approach ensures that the stock correction process is handled efficiently and provides immediate feedback to the user.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBUmV0YWlsSFVCLUZyb250ZW5kJTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="RetailHUB-Frontend"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
