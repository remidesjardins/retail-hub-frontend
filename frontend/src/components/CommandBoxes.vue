<!--
  =====================================================
  Project: RetailHub
  File: Commands.vue
  Description: Component for managing various commands such as adding products, stock correction, receipt of parcels, and placing products within RetailHub.
  Participants:
    - Alexandre Borny
    - Maël Castellan
    - Laura Donato
    - Rémi Desjardins
  =====================================================
-->

<template>
  <!-- Main container for the Commands component -->
  <div>
    <h2>Commands</h2>

    <!-- List of command options for the user to select -->
    <div class="command-list">
      <!-- Command box for receiving a receipt of a parcel -->
      <div class="command-box" @click="onCommandClick('receipt')">Receipt of a parcel</div>

      <!-- Command box for placing a product -->
      <div class="command-box" @click="onCommandClick('placeProduct')">Place a product</div>

      <!-- Command box for performing a stock correction -->
      <div class="command-box" @click="onCommandClick('stockCorrection')">Stock correction</div>

      <!-- Command box for adding a new product -->
      <div class="command-box" @click="onCommandClick('addProduct')" v-if="isAdmin">Add Product</div>
    </div>
  </div>

  <!-- AddProductForm component displayed conditionally -->
  <AddProductForm v-if="showAddProductForm" @close="closeForm" />

  <!-- StockCorrectionForm component displayed conditionally -->
  <StockCorrectionForm v-if="showStockCorrectionForm" @close="closeForm" />

  <!-- ReceiptParcelForm component displayed conditionally -->
  <ReceiptParcelForm v-if="showReceiptForm" @close="showReceiptForm = false" />

  <!-- PlaceProductForm component displayed conditionally -->
  <PlaceProductForm v-if="showPlaceProductForm" @close="showPlaceProductForm = false" />
</template>

<script>
/**
 * Commands Component
 * Manages various commands such as adding products, stock corrections, receipt of parcels, and placing products.
 */
import AddProductForm from '@/components/AddProductForm.vue';
import StockCorrectionForm from '@/components/StockCorrection.vue';
import ReceiptParcelForm from '@/components/ReceiptParcelForm.vue';
import PlaceProductForm from "@/components/PlaceProductForm.vue";

export default {
  components: {
    AddProductForm,
    StockCorrectionForm,
    ReceiptParcelForm,
    PlaceProductForm,
  },
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

      /**
       * Allows to only show the AddProduct command if the user is an ADMIN
       */
      isAdmin: this.$store.state.userIsAdmin
    };
  },
  methods: {
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

    /**
     * Handles the action for receiving a receipt of a parcel by displaying the ReceiptParcelForm.
     */
    handleReceiptOfParcel() {
      this.showReceiptForm = true; // Show the receipt form overlay
    },

    /**
     * Handles the action for placing a product by displaying the PlaceProductForm.
     */
    handlePlaceProduct() {
      this.showPlaceProductForm = true; // Show the place product form overlay
    },

    /**
     * Handles the action for performing a stock correction by displaying the StockCorrectionForm.
     */
    handleStockCorrection() {
      this.showStockCorrectionForm = true; // Show the stock correction form overlay
    },

    /**
     * Handles the action for adding a new product by displaying the AddProductForm.
     */
    handleAddProduct() {
      this.showAddProductForm = true; // Show the add product form overlay
    },

    /**
     * Closes the currently open form by resetting the visibility flags.
     */
    closeForm() {
      this.showStockCorrectionForm = false;
      this.showAddProductForm = false;
      // Note: ReceiptParcelForm and PlaceProductForm are closed directly via their @close events
    },
  },
};
</script>

<<style scoped>

h2 {
  margin: 1.5rem 0 0.5rem 0;
}

.command-list {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  justify-content: start;
}

.command-box {
  min-width: 12rem;
  max-width: 12rem;
  height: 11rem;
  padding: .625rem;
  border-radius: 1.25rem;
  background: #d0e7eb;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: left;
  display: flex;
  font-size: 2rem;
  font-weight: bold;
  color: black;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.command-box:hover {
  transform: scale(1.05); /* Slightly enlarges on hover */
}

</style>