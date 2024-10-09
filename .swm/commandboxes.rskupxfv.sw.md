---
title: CommandBoxes
---
# Introduction

This document will walk you through the implementation of the CommandBoxes feature in the <SwmToken path="/frontend/src/components/CommandBoxes.vue" pos="3:4:4" line-data="  Project: RetailHub">`RetailHub`</SwmToken> project.

The feature allows users to manage various commands such as adding products, stock correction, receipt of parcels, and placing products within <SwmToken path="/frontend/src/components/CommandBoxes.vue" pos="3:4:4" line-data="  Project: RetailHub">`RetailHub`</SwmToken>.

We will cover:

1. How the command options are presented to the user.
2. How the visibility of different forms is controlled.
3. How the click events are handled to trigger the appropriate actions.

# Command options presentation

<SwmSnippet path="/frontend/src/components/CommandBoxes.vue" line="14">

---

The main container for the Commands component includes a list of command options for the user to select. Each command box triggers a specific action when clicked.

```
<template>
  <!-- Main container for the Commands component -->
  <div>
    <h2>Commands</h2>

    <!-- List of command options for the user to select -->
    <div class="command-list">
      <!-- Command box for receiving a receipt of a parcel -->
      <div class="command-box" @click="onCommandClick('receipt')">Receipt of a parcel</div>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/CommandBoxes.vue" line="23">

---

Additional command boxes are included for placing a product, performing a stock correction, and adding a new product.

```

      <!-- Command box for placing a product -->
      <div class="command-box" @click="onCommandClick('placeProduct')">Place a product</div>

      <!-- Command box for performing a stock correction -->
      <div class="command-box" @click="onCommandClick('stockCorrection')">Stock correction</div>

      <!-- Command box for adding a new product -->
      <div class="command-box" @click="onCommandClick('addProduct')">Add Product</div>
    </div>
  </div>
```

---

</SwmSnippet>

# Conditional form display

<SwmSnippet path="/frontend/src/components/CommandBoxes.vue" line="34">

---

The component conditionally displays different forms based on the user's actions. Each form is shown only when the corresponding command is selected.

```

  <!-- AddProductForm component displayed conditionally -->
  <AddProductForm v-if="showAddProductForm" @close="closeForm" />

  <!-- StockCorrectionForm component displayed conditionally -->
  <StockCorrectionForm v-if="showStockCorrectionForm" @close="closeForm" />

  <!-- ReceiptParcelForm component displayed conditionally -->
  <ReceiptParcelForm v-if="showReceiptForm" @close="showReceiptForm = false" />

  <!-- PlaceProductForm component displayed conditionally -->
  <PlaceProductForm v-if="showPlaceProductForm" @close="showPlaceProductForm = false" />
</template>
```

---

</SwmSnippet>

# Component registration

<SwmSnippet path="/frontend/src/components/CommandBoxes.vue" line="59">

---

The forms used in the CommandBoxes component are registered as child components.

```
  components: {
    AddProductForm,
    StockCorrectionForm,
    ReceiptParcelForm,
    PlaceProductForm,
  },
```

---

</SwmSnippet>

# Data properties for form visibility

<SwmSnippet path="/frontend/src/components/CommandBoxes.vue" line="65">

---

The visibility of each form is controlled by specific data properties. These properties are initially set to false.

```
  data() {
    return {
      /**
       * Controls the visibility of the AddProductForm component.
       */
      showAddProductForm: false,

      /**
       * Controls the visibility of the StockCorrectionForm component.
       */
      showStockCorrectionForm: false,

      /**
       * Controls the visibility of the ReceiptParcelForm component.
       */
      showReceiptForm: false,

      /**
       * Controls the visibility of the PlaceProductForm component.
       */
      showPlaceProductForm: false,
    };
  },
```

---

</SwmSnippet>

# Handling command clicks

<SwmSnippet path="/frontend/src/components/CommandBoxes.vue" line="89">

---

The <SwmToken path="/frontend/src/components/CommandBoxes.vue" pos="93:1:1" line-data="    onCommandClick(action) {">`onCommandClick`</SwmToken> method handles the click events on the command boxes. It triggers the corresponding action based on the command selected by the user.

@param {string} <SwmToken path="/frontend/src/components/CommandBoxes.vue" pos="93:3:3" line-data="    onCommandClick(action) {">`action`</SwmToken> - The action identifier corresponding to the clicked command.

```
    /**
     * Handles the click event on a command box and triggers the corresponding action.
     * @param {string} action - The action identifier corresponding to the clicked command.
     */
    onCommandClick(action) {
      switch (action) {
        case 'receipt':
          this.handleReceiptOfParcel();
          break;
        case 'placeProduct':
          this.handlePlaceProduct();
          break;
        case 'stockCorrection':
          this.handleStockCorrection();
          break;
        case 'addProduct':
          this.handleAddProduct();
          break;
        default:
          console.log('Unknown action');
      }
    },
```

---

</SwmSnippet>

# Action handlers

<SwmSnippet path="/frontend/src/components/CommandBoxes.vue" line="112">

---

Each action handler method sets the visibility flag for the corresponding form to true, displaying the form overlay.

```
    /**
     * Handles the action for receiving a receipt of a parcel by displaying the ReceiptParcelForm.
     */
    handleReceiptOfParcel() {
      this.showReceiptForm = true; // Show the receipt form overlay
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/CommandBoxes.vue" line="119">

---

```
    /**
     * Handles the action for placing a product by displaying the PlaceProductForm.
     */
    handlePlaceProduct() {
      this.showPlaceProductForm = true; // Show the place product form overlay
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/CommandBoxes.vue" line="126">

---

```
    /**
     * Handles the action for performing a stock correction by displaying the StockCorrectionForm.
     */
    handleStockCorrection() {
      this.showStockCorrectionForm = true; // Show the stock correction form overlay
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/CommandBoxes.vue" line="133">

---

```
    /**
     * Handles the action for adding a new product by displaying the AddProductForm.
     */
    handleAddProduct() {
      this.showAddProductForm = true; // Show the add product form overlay
    },
```

---

</SwmSnippet>

# Closing forms

<SwmSnippet path="/frontend/src/components/CommandBoxes.vue" line="140">

---

The <SwmToken path="/frontend/src/components/CommandBoxes.vue" pos="143:1:1" line-data="    closeForm() {">`closeForm`</SwmToken> method resets the visibility flags to false, closing the currently open form. Note that some forms are closed directly via their <SwmToken path="/frontend/src/components/CommandBoxes.vue" pos="146:22:23" line-data="      // Note: ReceiptParcelForm and PlaceProductForm are closed directly via their @close events">`@close`</SwmToken> events.

```
    /**
     * Closes the currently open form by resetting the visibility flags.
     */
    closeForm() {
      this.showStockCorrectionForm = false;
      this.showAddProductForm = false;
      // Note: ReceiptParcelForm and PlaceProductForm are closed directly via their @close events
    },
```

---

</SwmSnippet>

This concludes the walkthrough of the CommandBoxes feature implementation. The component is located at <SwmPath>[frontend/src/components/CommandBoxes.vue](/frontend/src/components/CommandBoxes.vue)</SwmPath>.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBUmV0YWlsSFVCLUZyb250ZW5kJTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="RetailHUB-Frontend"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
