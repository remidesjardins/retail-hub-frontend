<!--
  =====================================================
  Project: RetailHub
  File: ReceiptParcelForm.vue
  Description: Component for handling the receipt of a parcel by updating the stock level of a product.
  Participants:
    - Alexandre Borny
    - Maël Castellan
    - Laura Donato
    - Rémi Desjardins
  =====================================================
-->

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

        <!-- Submit button to add the product -->
        <button type="submit" class="submit-btn">Add Product</button>
      </form>
    </div>
  </div>
</template>

<script>
/**
 * ReceiptParcelForm Component
 * Handles the receipt of a parcel by updating the stock level of a specified product.
 */
export default {
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
  methods: {
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

      try {
        // Fetch the current stock level from the backend using the SKU
        const response = await fetch(`https://com.servhub.fr/api/products/${this.parcel.SKU}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

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

        // Send a PUT request to update the stock level in the backend
        const updateResponse = await fetch(`https://com.servhub.fr/api/products/${this.parcel.SKU}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(placementData),
        });

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

    /**
     * Resets the form fields to their initial state.
     */
    resetForm() {
      this.parcel.SKU = '';
      this.parcel.receivedAmount = '';
    },
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

.receipt-parcel-form {
  background-color: white;
  padding: 1.25rem;
  border-radius: 1.875rem;
  width: 25rem;
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
  margin-bottom: .938rem;
}

.form-group label {
  display: block;
  margin-bottom: .313rem;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: .625rem;
  border: 1px solid black;
  border-radius: 1.563rem;
  font-size: 1rem;
}

.submit-btn {
  padding: .625rem 1.25rem;
  background-color: #80cbc4;
  color: white;
  border: none;
  border-radius: 1.563rem;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 0.5rem;
}

.submit-btn:hover {
  background-color: #5d8f8d;
}

</style>