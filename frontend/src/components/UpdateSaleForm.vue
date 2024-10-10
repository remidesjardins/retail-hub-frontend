<!--
 * RetailHub - UpdateSaleForm.vue
 *
 * Participants:
 * - Alexandre Borny
 * - Maël Castellan
 * - Laura Donato
 * - Rémi Desjardins
 *
 * This component provides a form to update an existing sale's information,
 * including customer details, total price, reference, and payment status.
 -->

<template>
  <div v-if="show" class="overlay">
    <div class="overlay-content">
      <div class="form-header">
        <h2>Update Sale</h2>
        <button @click="closeOverlay" class="close-btn">
          <i class="fa-solid fa-xmark fa-xl"></i>
        </button>
      </div>

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

        <!-- Payment Status -->
        <div class="form-group">
          <label for="payment_status">Payment Status</label>
          <select id="payment_status" v-model="sale.payment_status" required>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <!-- Submit and Close Buttons -->
        <div class="button-group">
          <button type="submit" class="submit-btn">Update Sale</button>
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

<script>
import UpdateClient from "@/components/UpdateClient.vue";

export default {
  components: { UpdateClient },

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

  data() {
    return {
      /**
       * Controls the visibility of the UpdateClient overlay.
       */
      showClientOverlay: false
    };
  },

  methods: {
    /**
     * Sends an update request to the server with the modified sale information.
     * Handles the response and potential errors.
     */
    async updateSale() {
      try {
        const token = this.$store.state.userToken;
        if (!token) {
          alert("User token is missing.");
          return;
        }else{
          console.log("USER TOKEN : ", token);
        }
        const response = await fetch(`https://com.servhub.fr/api/sales/${this.sale._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(this.sale)
        });

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

    /**
     * Opens the client modification overlay.
     */
    openClientOverlay() {
      this.showClientOverlay = true;
    },

    /**
     * Closes the client modification overlay.
     */
    closeClientOverlay() {
      this.showClientOverlay = false;
    },

    /**
     * Updates the sale's customer data with the modified client information.
     *
     * @param {Object} updatedClient - The updated client data.
     */
    updateClientData(updatedClient) {
      this.sale.customer = updatedClient;
      this.closeClientOverlay();
    },

    /**
     * Closes the sale update overlay.
     */
    closeOverlay() {
      this.$emit("closeOverlay");
    }
  }
};
</script>

<style scoped>

h2 {
  margin-bottom: 1rem;
}

/* Overlay styling */
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
  padding: 1.563rem;
  border-radius: 1.25rem;
  width: 28.125rem;
  max-width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

/* Form group styling */
.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: .5rem;
  font-weight: bold;
  color: #333;
}

.customer-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.customer-name {
  font-size: 1rem;
  margin-right: .625rem;
}

/* Modify Customer Button */
.modify-client-btn {
  padding: .5rem .938rem;
  background-color: #274156;
  border: none;
  color: white;
  border-radius: 1.25rem;
  cursor: pointer;
  font-size: .875rem;
  transition: background-color 0.3s ease;
}

.modify-client-btn:hover {
  background-color: #5d7180;
}

/* Input fields styling */
input[type="text"],
input[type="number"],
select {
  width: 100%;
  padding: .625rem;
  border: 1px solid #ccc;
  border-radius: 1.563rem;
  font-size: 1rem;
}

/* Button styling */
.button-group {
  display: flex;
  justify-content: space-between;
}

.submit-btn {
  padding: .625rem 1.25rem;
  background-color: #80cbc4;
  border: none;
  color: white;
  border-radius: 1.563rem;
  cursor: pointer;
  font-size: .875rem;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #5d8f8d;
}
</style>