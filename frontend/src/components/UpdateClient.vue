<!--
 * RetailHub - UpdateCliant.vue
 *
 * Participants:
 * - Alexandre Borny
 * - Maël Castellan
 * - Laura Donato
 * - Rémi Desjardins
 *
 * This component provides a form to modify an existing client's information in RetailHub.
 -->

<template>
  <div class="overlay">
    <div class="overlay-content">
      <!-- Close button to hide the overlay -->
      <button class="close-button" @click="closeOverlay">✖</button>

      <h1>Modify Client</h1>

      <!-- Form to update client information -->
      <form @submit.prevent="updateClient">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" v-model="client.name" required/>
        </div>

        <div class="form-group form-inline">
          <div>
            <label for="phone">Phone Number</label>
            <input type="text" id="phone" v-model="client.phone" required />
          </div>
          <div>
            <label for="email">Email</label>
            <input type="email" id="email" v-model="client.email" required />
          </div>
        </div>

        <div class="form-group form-group-address">
          <div>
            <label for="address">Address</label>
            <input type="text" placeholder="Street" v-model="client.addressLine1" required />
          </div>
          <div class="input-address">
            <input type="text" placeholder="City" v-model="client.city" required />
            <input type="text" placeholder="State" v-model="client.state" required />
            <input type="text" placeholder="Postal Code" v-model="client.postalCode" required />
            <input type="text" placeholder="Country" v-model="client.country" class="full-width" required />
          </div>
        </div>

        <button type="submit" class="update-client-button">Modify Client</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    /**
     * The client object containing current client information.
     * This prop is required for the component to function correctly.
     */
    client: {
      type: Object,
      required: true,
    },
  },

  methods: {
    /**
     * Closes the overlay without saving any changes.
     * Emits a 'close' event to notify the parent component.
     */
    closeOverlay() {
      this.$emit('close');
    },

    /**
     * Sends an update request to the server with the modified client information.
     * Handles the response and potential errors.
     */
    updateClient() {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const updatedClientData = JSON.stringify({
        name: this.client.name,
        email: this.client.email,
        phone: this.client.phone,
        address: {
          addressLine1: this.client.addressLine1,
          city: this.client.city,
          state: this.client.state,
          postalCode: this.client.postalCode,
          country: this.client.country,
        },
      });

      const requestOptions = {
        headers: myHeaders,
        method: "PUT",
        body: updatedClientData,
        redirect: "follow"
      };

      fetch(`https://com.servhub.fr/api/customers/${this.client._id}`, requestOptions)
          .then((response) => {
            if (!response.ok) {
              return response.json().then((error) => {
                throw new Error(error.message);
              });
            }
            return response.json();
          })
          .then((result) => {
            this.closeOverlayWithData();
          })
          .catch((error) => {
            alert(`Error updating client: ${error.message}`);
          });
    },

    /**
     * Closes the overlay and emits the updated client data to the parent component.
     */
    closeOverlayWithData() {
      this.$emit('close-data', this.client);
    },
  },
};
</script>

<style scoped>
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
  padding: 1.875rem;
  border-radius: 1.25rem;
  width: 25rem;
  max-width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.close-button {
  position: absolute;
  top: .625rem;
  right: .625rem;
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: grey;
}

h1 {
  text-align: center;
  margin-bottom: 1.25rem;
  font-size: 1.5rem;
  color: #333;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.25rem;
}

.form-group-address {
  display: flex;
  gap: .625rem;
}

.form-group label {
  display: block;
  margin-bottom: .313rem;
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: .625rem;
  border: 1px solid #ccc;
  border-radius: 1.563rem;
  font-size: 1rem;
}

.form-inline {
  display: flex;
  justify-content: space-between;
  gap: .625rem;
}

.form-inline div {
  flex: 1;
}

.form-group textarea {
  resize: none;
  height: 5rem;
}

.input-address {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: .625rem;

}

.update-client-button {
  width: 100%;
  padding: .625rem;
  background-color: #80cbc4;
  border: none;
  color: white;
  border-radius: 1.563rem;
  cursor: pointer;
  font-size: .875rem;
  transition: background-color 0.3s ease;
}

.update-client-button:hover {
  background-color: #5d8f8d;
}
</style>