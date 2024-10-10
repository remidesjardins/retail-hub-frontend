<!--
  =====================================================
  Project: RetailHub
  File: CreateClient.vue
  Description: Component for creating a new client within RetailHub.
  Participants:
    - Alexandre Borny
    - Maël Castellan
    - Laura Donato
    - Rémi Desjardins
  =====================================================
-->

<template>
  <!-- Overlay container to focus on the Create Client form -->
  <div class="overlay-create-client">
    <div class="overlay-content">
      <!-- Close button to exit the Create Client overlay -->
      <button class="close-button" @click="closeOverlay">✖</button>

      <!-- Header for the Create Client form -->
      <h1>Create Client</h1>

      <!-- Form for creating a new client -->
      <form @submit.prevent="submitForm">
        <!-- Group for Last Name and First Name inputs -->
        <div class="form-group">
          <input
              type="text"
              placeholder="Last Name"
              v-model="client.lastName"
              required
          />
          <input
              type="text"
              placeholder="First Name"
              v-model="client.firstName"
              required
          />
        </div>

        <!-- Group for Phone Number and E-Mail inputs -->
        <div class="form-group">
          <input
              type="text"
              placeholder="Phone Number"
              v-model="client.phoneNumber"
              required
          />
          <input
              type="email"
              placeholder="Email"
              v-model="client.email"
              class="full-width"
              required
          />
        </div>

        <!-- Group for Address inputs -->
        <div class="form-group form-group-address">
          <input
              type="text"
              placeholder="Street"
              v-model="client.addressLine1"
              required
          />
          <input
              type="text"
              placeholder="City"
              v-model="client.city"
              required
          />
          <input
              type="text"
              placeholder="State"
              v-model="client.state"
              required
          />
          <input
              type="text"
              placeholder="Postal Code"
              v-model="client.postalCode"
              required
          />
          <input
              type="text"
              placeholder="Country"
              v-model="client.country"
              class="full-width"
              required
          />
        </div>

        <!-- Submit button to create the client -->
        <button
            type="submit"
            class="create-client-button"
            @click="createClient"
        >
          Create client
        </button>
      </form>
    </div>
  </div>
</template>

<script>
/**
 * CreateClient Component
 * Provides a form for creating a new client in RetailHub.
 */
export default {
  data() {
    return {
      /**
       * Object holding the client's information entered in the form.
       */
      client: {
        lastName: '',
        firstName: '',
        phoneNumber: '',
        email: '',
        addressLine1: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
      }
    };
  },
  methods: {
    /**
     * Closes the Create Client overlay by emitting a 'close' event to the parent component.
     */
    closeOverlay() {
      this.$emit('close');
    },

    /**
     * Handles the form submission by logging the client data and initiating the client creation process.
     */
    submitForm() {
      // Log the client data for debugging purposes
      console.log(this.client);
      // Call the method to create the client
      this.createClient();
    },

    /**
     * Sends a POST request to the API to create a new client with the entered information.
     * Upon successful creation, it closes the overlay and logs the result.
     */
    createClient() {
      const accessToken = this.$store.state.userToken;
      // Set up the request headers
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", 'Bearer ' + accessToken);

      // Combine first name and last name into a single 'name' field
      const name = `${this.client.firstName} ${this.client.lastName}`;

      // Combine address fields into a single 'address' string
      const fullAddress = `${this.client.addressLine1}, ${this.client.city}, ${this.client.state}, ${this.client.postalCode}, ${this.client.country}`;

      // Prepare the request body with the client information
      const row = JSON.stringify({
        name: name,
        email: this.client.email,
        phone: this.client.phoneNumber,
        address: fullAddress // Combine all address fields into one string
      });

      // Define the request options for the fetch API
      const requestOptions = {
        headers: myHeaders,
        method: "POST",
        body: row,
        redirect: "follow"
      };

      // Send the POST request to create the new client
      fetch("https://com.servhub.fr/api/customers/", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            // Log the result for debugging purposes
            console.log(result);
            // Optionally, you can emit an event or perform additional actions here
          })
          .catch((error) => console.error("Error creating client:", error));

      // Emit the 'close' event to close the overlay after attempting to create the client
      this.$emit('close');
    },
  }
};
</script>

<style scoped>
.overlay-create-client {
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

.overlay-content {
  background-color: white;
  padding: 1.25rem;
  border-radius: 1.5rem;
  width: 28.125rem;
  position: relative;
}

.close-button {
  position: absolute;
  top: .625rem;
  right: .625rem;
  background-color: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: grey;
}

h1 {
  font-size: 1.5rem;
  margin-bottom: 1.25rem;
  text-align: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: .938rem;
  margin-bottom: 1.25rem;
}

input, textarea {
  width: 100%;
  padding: .625rem;
  border: 2px solid #ccc;
  border-radius: 1.5rem;
  font-size: 1rem;
}

.create-client-button {
  width: 100%;
  padding: .625rem;
  background-color: #80cbc4;
  border: none;
  border-radius: 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  color: white;
}

.create-client-button:hover {
  background-color: #5d8f8d;
}

/* Style for address input fields */
.form-group-address {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: .625rem;
}

input {
  box-sizing: border-box;
}

/* Making sure the full width inputs (email, etc.) stretch the whole width */
.full-width {
  grid-column: span 2;
}

</style>