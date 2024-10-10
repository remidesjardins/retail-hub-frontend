<!--
 * RetailHub - ClientSearchView.vue
 *
 * Participants:
 * - Alexandre Borny
 * - Maël Castellan
 * - Laura Donato
 * - Rémi Desjardins
 *
 * This component provides a user interface for searching and managing clients within RetailHub.
 * Users can search for clients by various criteria, view the list of clients, and create new clients.
 * Additionally, it includes navigation to invoice search and client detail pages.
 -->

<template>
  <div class="client-site">
    <!-- Navigation Bar -->
    <NavBar/>

    <!-- Sidebar / Navbar -->
    <div class="top-section"></div>

    <!-- Top Bar with Tab Buttons -->
    <div class="top-bar">
      <!-- Client Tab Button -->
      <button
          :class="{ active: activeTab === 'client' }"
          @click="switchTab('client')"
      >
        Client
      </button>

      <!-- Invoice Tab Button -->
      <button
          :class="{ active: activeTab === 'invoice' }"
          @click="switchTab('invoice')"
      >
        Invoice
      </button>
    </div>

    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Search Form for Clients -->
      <div class="search-form">
        <form @submit.prevent="filteredClients">
          <!-- Last Name Search Field -->
          <div>
            <label>
              Last Name
              <input type="text" v-model="search.lastName" class="custom-input"/>
            </label>
          </div>

          <!-- First Name Search Field -->
          <div>
            <label>
              First Name
              <input type="text" v-model="search.firstName" class="custom-input"/>
            </label>
          </div>

          <p>Or</p>

          <!-- Phone Number Search Field -->
          <div>
            <label>
              Phone Number
              <input type="text" v-model="search.phoneNumber" class="custom-input"/>
            </label>
          </div>

          <p>Or</p>

          <!-- E-Mail Search Field -->
          <div>
            <label>
              E-Mail
              <input type="text" v-model="search.email" class="custom-input"/>
            </label>
          </div>
        </form>
      </div>

      <!-- Clients List Display -->
      <div class="clients-list">
        <h3>Clients</h3>
        <div class="clients-list-content">
          <!-- Message when no clients are found -->
          <div v-if="filteredClients.length === 0">No clients found.</div>

          <!-- List of Client Cards -->
          <div
              v-for="client in filteredClients"
              :key="client.id"
              class="client-card"
              @click="goToClientPage(client._id)"
          >
            <!-- Client Information Section -->
            <div class="client-info">
              <p class="client-name">{{ client.name }}</p>
              <p>{{ client.address }}</p>
            </div>

            <!-- Client Contact Information -->
            <div class="client-contact">
              <p>{{ client.phone }}</p>
              <p>{{ client.email }}</p>
            </div>
          </div>
        </div>

        <!-- Button to Open Create Client Overlay -->
        <button class="create-client-btn" @click="openCreateClient">Create client</button>
      </div>
    </div>

    <!-- CreateClient Component Overlay -->
    <CreateClient
        v-if="showCreateClient"
        @close="closeCreateClient"
    />
  </div>
</template>

<script>
import CreateClient from "@/components/CreateClient.vue";
import NavBar from "@/components/NavBar.vue";
import {log10} from "chart.js/helpers";

export default {
  components: {
    CreateClient,
    NavBar,
  },

  data() {
    return {
      /**
       * Currently active tab ('client' or 'invoice').
       */
      activeTab: 'client',

      /**
       * Search criteria for filtering clients.
       */
      search: {
        lastName: '',
        firstName: '',
        phoneNumber: '',
        email: '',
      },

      /**
       * Array of all clients fetched from the backend.
       */
      clients: [],

      /**
       * Flag to control the visibility of the CreateClient overlay.
       */
      showCreateClient: false,
    };
  },

  computed: {
    /**
     * Filters the list of clients based on the search criteria.
     *
     * @returns {Array} - Array of clients that match the search criteria.
     */
    filteredClients() {
      return this.clients.filter((client) => {
        const matchesLastName = this.search.lastName === '' || client.name.toLowerCase().includes(this.search.lastName.toLowerCase());
        const matchesFirstName = this.search.firstName === '' || client.name.toLowerCase().includes(this.search.firstName.toLowerCase());
        const matchesPhone = this.search.phoneNumber === '' || this.normalizePhoneNumber(client.phone).includes(this.normalizePhoneNumber(this.search.phoneNumber));
        const matchesEmail = this.search.email === '' || client.email.toLowerCase().includes(this.search.email.toLowerCase());

        return matchesLastName && matchesFirstName && matchesPhone && matchesEmail;
      });
    }
  },

  methods: {
    /**
     * Fetches the initial list of clients from the backend API.
     */
    fetchInitialClients() {
      const token = localStorage.getItem('authToken');
      const requestOptions = {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        redirect: "follow",
      };
      fetch("https://com.servhub.fr/api/customers/", requestOptions)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((result) => {
            console.log("API Result:", result);
            this.clients = Array.isArray(result) ? result : [];
          })
          .catch((error) => console.error("Error fetching clients:", error));

    },

    /**
     * Switches the active tab between 'client' and 'invoice'.
     *
     * @param {string} tab - The tab to switch to ('client' or 'invoice').
     */
    switchTab(tab) {
      this.activeTab = tab;
      if (tab === 'invoice') {
        this.$router.push({ name: 'InvoiceSearch' }); // Redirect to InvoiceSearchView
      }
    },

    /**
     * Normalizes a phone number by removing all non-digit characters.
     *
     * @param {string} phoneNumber - The phone number to normalize.
     * @returns {string} - The normalized phone number containing only digits.
     */
    normalizePhoneNumber(phoneNumber) {
      // Remove all non-digit characters
      return phoneNumber.replace(/\D/g, '');
    },

    /**
     * Opens the CreateClient overlay to allow the user to create a new client.
     */
    openCreateClient() {
      this.showCreateClient = true;
    },

    /**
     * Closes the CreateClient overlay without saving changes.
     */
    closeCreateClient() {
      this.showCreateClient = false;
    },

    /**
     * Navigates to the client detail page for the selected client.
     *
     * @param {string} clientId - The unique identifier of the client.
     */
    goToClientPage(clientId) {
      this.$router.push(`/client/${clientId}`);
    },
  },

  /**
   * Lifecycle hook called when the component is mounted.
   * Initiates fetching of client data.
   */
  mounted() {
    this.fetchInitialClients();
  }
};
</script>

<style scoped>

form p {
  margin: 1rem;
  display: flex;
  justify-content: center;
}

.client-site {
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
}

.main-content {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  padding: 1.25rem;
  width: 100%;
}

.client-site {
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
}

.main-content {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  padding: 1.25rem;
  width: 100%;
  margin-left: 3rem;
}

.top-bar {
  display: flex;
  justify-content: center; /* Center the buttons horizontally */
  position: absolute;
  border-radius: 1.5rem;
  background-color: #fafafa;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: .625rem 0;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 1.25rem;
  z-index: 100;
}

.top-bar button {
  padding: .75rem 1.5rem;
  border: none;
  border-radius: 1.875rem; /* Make the button rounded */
  background-color: #f0f0f0; /* Light grey background */
  cursor: pointer;
  margin: 0 .625rem;
  font-size: 1rem;
  color: #333;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); /* Add subtle shadow */
}

.top-bar button.active {
  background-color: #80cbc4; /* Active state background */
}

.top-bar button:hover {
  background-color: #e0e0e0; /* Slightly darker grey when hovered */
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: .625rem;
  max-width: 18.75rem; /* Assurez-vous que la largeur ne dépasse pas trop */
}

.search-form div{
  margin-top: .625rem;
}

.search-form label {
  font-size: 1.125rem;
  margin: .313rem;
}

.search-form input {
  padding: .75rem;
  border-radius: 1.5rem;
  border: 1px solid #ccc;
  width: 100%;
}
.search-form {
  flex-grow: 1;
  margin: 0 1.25rem;
}
.search-bar input {
  width: 90%;
  padding: .625rem;
  font-size: 1rem;
  border: 2px solid black;
  border-radius: 1.875rem;
  background: white;
}
.search-bar input::placeholder {
  color: black;
}

.custom-input {
  border-radius: .625rem;
  transition: box-shadow 0.3s ease;
}

.custom-input:focus {
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
}

.clients-list {
  background-color: #e0f7fa;
  padding: 1.25rem;
  border-radius: .938rem;
  width: 100%;
  max-width: 37.5rem;
  margin-left: 1.25rem; /* Ajoute un espace entre la search-form et la clients-list */
  height: 25rem;
}

.clients-list-content{
  overflow: scroll;
  max-height: 20rem;
}

.clients-list h3 {
  font-size: 1.5rem;
  margin-bottom: 1.25rem;
}

.client-card {
  display: flex;
  justify-content: space-between;
  align-items: stretch; /* Assure que les hauteurs de .client-info et .client-contact soient les mêmes */
  padding: .938rem;
  margin-bottom: .938rem;
}

.client-info {
  flex: 2;
  background-color: white;
  border-radius: 1.5rem;
  padding: .938rem;
  margin-right: 1.25rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column; /* Aligne le contenu verticalement */
  justify-content: center; /* Centre le contenu verticalement */
  cursor: pointer;
}

.client-info .client-name {
  font-weight: bold;
  margin-bottom: .313rem;
  font-size: 1.125rem;
}

.client-contact {
  flex: 1;
  background-color: white;
  border-radius: 1.5rem;
  padding: .938rem;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column; /* Aligne le contenu verticalement */
  justify-content: center; /* Centre le contenu verticalement */
  cursor: pointer;
}

.client-contact p {
  margin: .313rem 0;
  font-size: .875rem;
}

.create-client-btn {
  background-color: #80cbc4;
  border: none;
  padding: .75rem 1.5rem;
  border-radius: 1.563rem;
  color: white;
  cursor: pointer;
  margin-top: 1.25rem;
  align-self: flex-end;
  transition: background-color 0.3s ease;
}

.create-client-btn:hover {
  background-color: #3b5998;
}

.search-bar{
  width: 100%;
}
.search-bar input {
  padding: .625rem;
  font-size: 1rem;
  width: 18.75rem;
}
</style>