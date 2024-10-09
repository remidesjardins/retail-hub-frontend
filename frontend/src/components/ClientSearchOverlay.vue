<!--
  =====================================================
  Project: RetailHub
  File: ClientSearchOverlay.vue
  Description: Component for searching and managing clients within RetailHub.
  Participants:
    - Alexandre Borny
    - Maël Castellan
    - Laura Donato
    - Rémi Desjardins
  =====================================================
-->

<template>
  <!-- Overlay container to darken the background and focus on the client search modal -->
  <div class="overlay-container">
    <div class="overlay">
      <!-- Close button to exit the client search overlay -->
      <button class="close-button" @click="closeClientSearch">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <!-- Main Content inside Overlay -->
      <div class="main-content">
        <!-- Search Form for filtering clients -->
        <div class="search-form">
          <form @submit.prevent="filteredClients">
            <!-- Last Name Input Field -->
            <div class="form-group">
              <label>Last Name</label>
              <input type="text" v-model="search.lastName" class="custom-input"/>
            </div>

            <!-- First Name Input Field -->
            <div class="form-group">
              <label>First Name</label>
              <input type="text" v-model="search.firstName" class="custom-input"/>
            </div>

            <!-- Separator Text -->
            <p class="separator">Or</p>

            <!-- Phone Number Input Field -->
            <div class="form-group">
              <label>Phone Number</label>
              <input type="text" v-model="search.phoneNumber" class="custom-input"/>
            </div>

            <!-- Separator Text -->
            <p class="separator">Or</p>

            <!-- E-Mail Input Field -->
            <div class="form-group">
              <label>E-Mail</label>
              <input type="text" v-model="search.email" class="custom-input"/>
            </div>

            <!-- Submit Button for Search Form -->
            <button type="submit" class="submit-btn">Search</button>
          </form>
        </div>

        <!-- Clients List Display -->
        <div class="clients-list">
          <h3>Clients</h3>

          <!-- Message displayed when no clients are found -->
          <div v-if="filteredClients.length === 0">No clients found.</div>

          <!-- Loop through filtered clients and display each client -->
          <div
              v-for="client in filteredClients"
              :key="client.id"
              class="client-card"
              @click="chooseClient(client)"
          >
            <div class="client-info">
              <p class="client-name">{{ client.name }}</p>
              <p>{{ client.address }}</p>
            </div>
            <div class="client-contact">
              <p>{{ client.phone }}</p>
              <p>{{ client.email }}</p>
            </div>
          </div>

          <!-- Button to open the Create Client modal -->
          <button class="create-client-btn" @click="openCreateClient">Create client</button>
        </div>
      </div>

      <!-- Create Client Modal Component -->
      <CreateClient
          v-if="showCreateClient"
          @close="closeCreateClient"
      />
    </div>
  </div>
</template>

<script>
/**
 * ClientSearchOverlay Component
 * Provides functionality to search, view, and manage clients within RetailHub.
 */
import NavBar from "@/components/NavBar.vue";
import CreateClient from "@/components/CreateClient.vue";

export default {
  components: {
    NavBar,
    CreateClient,
  },
  data() {
    return {
      /**
       * Currently active tab in the overlay (if applicable).
       */
      activeTab: 'client',

      /**
       * Object holding the search criteria entered by the user.
       */
      search: {
        lastName: '',
        firstName: '',
        phoneNumber: '',
        email: '',
      },

      /**
       * Array storing all clients fetched from the API.
       */
      clients: [],

      /**
       * Boolean flag to control the visibility of the Create Client modal.
       */
      showCreateClient: false,
    };
  },
  computed: {
    /**
     * Filters the list of clients based on the search criteria.
     * @returns {Array} An array of clients that match the search criteria.
     */
    filteredClients() {
      return this.clients.filter((client) => {
        const matchesLastName =
            this.search.lastName === '' ||
            client.name.toLowerCase().includes(this.search.lastName.toLowerCase());

        const matchesFirstName =
            this.search.firstName === '' ||
            client.name.toLowerCase().includes(this.search.firstName.toLowerCase());

        const matchesPhone =
            this.search.phoneNumber === '' ||
            this.normalizePhoneNumber(client.phone).includes(
                this.normalizePhoneNumber(this.search.phoneNumber)
            );

        const matchesEmail =
            this.search.email === '' ||
            client.email.toLowerCase().includes(this.search.email.toLowerCase());

        return matchesLastName && matchesFirstName && matchesPhone && matchesEmail;
      });
    },
  },
  methods: {
    /**
     * Fetches the initial list of clients from the API when the component is mounted.
     */
    fetchInitialClients() {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch("https://com.servhub.fr/api/customers/", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            this.clients = result;
          })
          .catch((error) => console.error("Error fetching clients:", error));
    },

    /**
     * Normalizes a phone number by removing all non-digit characters.
     * @param {string} phoneNumber - The phone number to normalize.
     * @returns {string} The normalized phone number containing only digits.
     */
    normalizePhoneNumber(phoneNumber) {
      return phoneNumber.replace(/\D/g, '');
    },

    /**
     * Opens the Create Client modal by setting the corresponding flag to true.
     */
    openCreateClient() {
      this.showCreateClient = true;
    },

    /**
     * Closes the Create Client modal by setting the corresponding flag to false.
     */
    closeCreateClient() {
      this.showCreateClient = false;
    },

    /**
     * Closes the Client Search overlay by emitting a 'close' event to the parent component.
     */
    closeClientSearch() {
      this.$emit("close");
    },

    /**
     * Selects a client and emits the selected client's data to the parent component.
     * @param {Object} client - The client object that was selected.
     */
    chooseClient(client) {
      this.$emit("close-data", client);
    },
  },
  mounted() {
    // Fetch the initial list of clients when the component is mounted
    this.fetchInitialClients();
  },
};
</script>

<style scoped>

h3 {
  margin-bottom: 1rem;
}

.overlay-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.overlay {
  background: white;
  width: 80%;
  max-width: 56.25rem;
  height: 80%;
  border-radius: .938rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  padding: 1.25rem;
  position: relative;
}

.close-button {
  position: absolute;
  top: .625rem;
  right: .625rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: grey;
  transition: color 0.3s ease;
}

.main-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 1.25rem;
}

.search-form {
  margin-bottom: 1.25rem;
}

.form-group {
  margin-bottom: .938rem;
}

.form-group label {
  display: block;
  margin-bottom: .313rem;
  font-weight: bold;
}

.custom-input {
  width: 100%;
  padding: .625rem;
  border: 1px solid #ccc;
  border-radius: 1.5rem;
  font-size: 1rem;
}

.separator {
  margin: .625rem 0;
  text-align: center;
  font-weight: bold;
}

.submit-btn {
  background-color: #80cbc4;
  color: white;
  padding: .625rem 1.25rem;
  border: none;
  border-radius: 1.5rem;
  cursor: pointer;
}

.submit-btn:hover,
.create-client-btn:hover {
  background-color: #5d8f8d;
}

.clients-list {
  background-color: #e0f7fa;
  padding: 1.25rem;
  border-radius: 1.5rem;
  margin-top: 1.25rem;
}

.client-card {
  display: flex;
  justify-content: space-between;
  padding: .938rem;
  background-color: white;
  border-radius: 1.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: .625rem;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}

.client-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.create-client-btn {
  background-color: #80cbc4;
  border: none;
  padding: .75rem 1.5rem;
  border-radius: 1.5rem;
  color: white;
  cursor: pointer;
  margin-top: 1.25rem;
}

.client-info,
.client-contact {
  flex: 1;
  padding: .625rem;
}
</style>