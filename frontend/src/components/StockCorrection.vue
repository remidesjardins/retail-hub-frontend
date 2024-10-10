<!--
 * RetailHub - StockCorrection.vue
 *
 * Participants:
 * - Alexandre Borny
 * - Maël Castellan
 * - Laura Donato
 * - Rémi Desjardins
 *
 * This component provides a form for correcting the stock of a product
 * by adjusting its current stock based on the provided SKU code and adjustment number.
 -->

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

        <!-- Submit Button -->
        <button type="submit" class="submit-btn">Correct Product</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
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

  methods: {
    /**
     * Corrects the stock of a product based on the provided SKU and adjustment number.
     * It fetches the current stock, applies the adjustment, and updates the stock on the server.
     */
    async correctStock() {
      if (!this.correction.SKU || !this.correction.adjustment) {
        alert("Please fill in both SKU Code and Stock Adjustment.");
        return;
      }

      const token = localStorage.getItem('authToken');

      try {
        const response = await fetch(`https://com.servhub.fr/api/products/${this.correction.SKU}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          alert(`Error fetching product with SKU: ${this.correction.SKU}`);
          return;
        }

        const product = await response.json();

        const stockCorrectionData = {
          SKU: this.correction.SKU,
          Current_stock: this.correction.adjustment,
        };

        const updateResponse = await fetch(`https://com.servhub.fr/api/products/${this.correction.SKU}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(stockCorrectionData),
        });

        if (updateResponse.ok) {
          const result = await updateResponse.json();
          alert(`Stock corrected successfully for SKU: ${this.correction.SKU}`);
          console.log('Stock correction response:', result);
          this.$emit('close');
        } else {
          const errorData = await updateResponse.json();
          alert(`Error correcting stock: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error during stock correction:', error);
        alert('An error occurred while correcting the stock.');
      }
    },
  }
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

.stock-correction-form {
  background-color: white;
  padding: 1.25rem;
  border-radius: 1.875rem;
  width: 100%;
  max-width: 25rem;
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
  margin-bottom: .938rem;
}

.form-group {
  display: flex;
  flex-direction: column;
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