---
title: ClientSearchView
---
# Introduction

This document will walk you through the implementation of the <SwmToken path="/frontend/src/views/ClientSearchView.vue" pos="2:7:7" line-data=" * RetailHub - ClientSearchView.vue">`ClientSearchView`</SwmToken> feature.

The feature provides a user interface for searching and managing clients within <SwmToken path="/frontend/src/views/ClientSearchView.vue" pos="2:3:3" line-data=" * RetailHub - ClientSearchView.vue">`RetailHub`</SwmToken>. Users can search for clients by various criteria, view the list of clients, and create new clients. Additionally, it includes navigation to invoice search and client detail pages.

We will cover:

1. The structure of the <SwmToken path="/frontend/src/views/ClientSearchView.vue" pos="2:7:7" line-data=" * RetailHub - ClientSearchView.vue">`ClientSearchView`</SwmToken> component.
2. The search functionality and how it filters clients.
3. The tab switching mechanism.
4. The client creation overlay.
5. Navigation to client detail and invoice search pages.

# Component structure

<SwmSnippet path="/frontend/src/views/ClientSearchView.vue" line="1">

---

The <SwmToken path="/frontend/src/views/ClientSearchView.vue" pos="2:7:7" line-data=" * RetailHub - ClientSearchView.vue">`ClientSearchView`</SwmToken> component is defined in <SwmPath>[frontend/src/views/ClientSearchView.vue](/frontend/src/views/ClientSearchView.vue)</SwmPath>. It includes a navigation bar, a top bar with tab buttons, a search form, a client list display, and a create client overlay.

```
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
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/ClientSearchView.vue" line="15">

---

The template structure starts with the navigation bar and top section.

```
<template>
  <div class="client-site">
    <!-- Navigation Bar -->
    <NavBar/>

    <!-- Sidebar / Navbar -->
    <div class="top-section"></div>
```

---

</SwmSnippet>

# Tab buttons

<SwmSnippet path="/frontend/src/views/ClientSearchView.vue" line="22">

---

The top bar includes buttons to switch between the client and invoice tabs. The active tab is highlighted.

```

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
```

---

</SwmSnippet>

# Search form

<SwmSnippet path="/frontend/src/views/ClientSearchView.vue" line="41">

---

The main content area includes a search form where users can filter clients by last name, first name, phone number, or email.

```

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
```

---

</SwmSnippet>

# Client list display

<SwmSnippet path="/frontend/src/views/ClientSearchView.vue" line="84">

---

The client list display shows the filtered clients. If no clients match the search criteria, a message is displayed. Each client card includes client information and contact details.

```

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
```

---

</SwmSnippet>

# Create client button

<SwmSnippet path="/frontend/src/views/ClientSearchView.vue" line="112">

---

A button is provided to open the create client overlay, allowing users to add new clients.

```

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
```

---

</SwmSnippet>

# Component registration

<SwmSnippet path="/frontend/src/views/ClientSearchView.vue" line="131">

---

The necessary components, such as <SwmToken path="/frontend/src/views/ClientSearchView.vue" pos="132:1:1" line-data="    CreateClient,">`CreateClient`</SwmToken> and <SwmToken path="/frontend/src/views/ClientSearchView.vue" pos="133:1:1" line-data="    NavBar,">`NavBar`</SwmToken>, are registered within the <SwmToken path="/frontend/src/views/ClientSearchView.vue" pos="2:7:7" line-data=" * RetailHub - ClientSearchView.vue">`ClientSearchView`</SwmToken> component.

```
  components: {
    CreateClient,
    NavBar,
  },
```

---

</SwmSnippet>

# Data properties

<SwmSnippet path="/frontend/src/views/ClientSearchView.vue" line="136">

---

The data properties include the active tab, search criteria, list of clients, and a flag to control the visibility of the create client overlay.

```
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
```

---

</SwmSnippet>

# Computed properties

<SwmSnippet path="/frontend/src/views/ClientSearchView.vue" line="165">

---

The <SwmToken path="/frontend/src/views/ClientSearchView.vue" pos="171:1:1" line-data="    filteredClients() {">`filteredClients`</SwmToken> computed property filters the list of clients based on the search criteria.

@returns {Array} - Array of clients that match the search criteria.

```
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
```

---

</SwmSnippet>

# Fetching clients

<SwmSnippet path="/frontend/src/views/ClientSearchView.vue" line="184">

---

The <SwmToken path="/frontend/src/views/ClientSearchView.vue" pos="187:1:1" line-data="    fetchInitialClients() {">`fetchInitialClients`</SwmToken> method fetches the initial list of clients from the backend API when the component is mounted.

```
    /**
     * Fetches the initial list of clients from the backend API.
     */
    fetchInitialClients() {
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };

      fetch("https://com.servhub.fr/api/customers/", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            this.clients = result;
          })
          .catch((error) => console.error(error));
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/ClientSearchView.vue" line="248">

---

```
  /**
   * Lifecycle hook called when the component is mounted.
   * Initiates fetching of client data.
   */
  mounted() {
    this.fetchInitialClients();
  }
```

---

</SwmSnippet>

# Tab switching

<SwmSnippet path="/frontend/src/views/ClientSearchView.vue" line="201">

---

The <SwmToken path="/frontend/src/views/ClientSearchView.vue" pos="206:1:1" line-data="    switchTab(tab) {">`switchTab`</SwmToken> method switches the active tab between 'client' and 'invoice'. If the invoice tab is selected, the user is redirected to the <SwmToken path="/frontend/src/views/ClientSearchView.vue" pos="209:26:26" line-data="        this.$router.push({ name: &#39;InvoiceSearch&#39; }); // Redirect to InvoiceSearchView">`InvoiceSearchView`</SwmToken>.

@param {string} <SwmToken path="/frontend/src/views/ClientSearchView.vue" pos="206:3:3" line-data="    switchTab(tab) {">`tab`</SwmToken> - The tab to switch to ('client' or 'invoice').

```
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
```

---

</SwmSnippet>

# Phone number normalization

<SwmSnippet path="/frontend/src/views/ClientSearchView.vue" line="213">

---

The <SwmToken path="/frontend/src/views/ClientSearchView.vue" pos="219:1:1" line-data="    normalizePhoneNumber(phoneNumber) {">`normalizePhoneNumber`</SwmToken> method removes all <SwmToken path="/frontend/src/views/ClientSearchView.vue" pos="214:17:19" line-data="     * Normalizes a phone number by removing all non-digit characters.">`non-digit`</SwmToken> characters from a phone number.

@param {string} <SwmToken path="/frontend/src/views/ClientSearchView.vue" pos="219:3:3" line-data="    normalizePhoneNumber(phoneNumber) {">`phoneNumber`</SwmToken> - The phone number to normalize.\
@returns {string} - The normalized phone number containing only digits.

```
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
```

---

</SwmSnippet>

# Create client overlay

<SwmSnippet path="/frontend/src/views/ClientSearchView.vue" line="224">

---

The <SwmToken path="/frontend/src/views/ClientSearchView.vue" pos="227:1:1" line-data="    openCreateClient() {">`openCreateClient`</SwmToken> and <SwmToken path="/frontend/src/views/ClientSearchView.vue" pos="121:5:5" line-data="        @close=&quot;closeCreateClient&quot;">`closeCreateClient`</SwmToken> methods control the visibility of the create client overlay.

```
    /**
     * Opens the CreateClient overlay to allow the user to create a new client.
     */
    openCreateClient() {
      this.showCreateClient = true;
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/ClientSearchView.vue" line="231">

---

```
    /**
     * Closes the CreateClient overlay without saving changes.
     */
    closeCreateClient() {
      this.showCreateClient = false;
    },
```

---

</SwmSnippet>

# Navigation to client detail page

<SwmSnippet path="/frontend/src/views/ClientSearchView.vue" line="238">

---

The <SwmToken path="/frontend/src/views/ClientSearchView.vue" pos="243:1:1" line-data="    goToClientPage(clientId) {">`goToClientPage`</SwmToken> method navigates to the client detail page for the selected client.

@param {string} <SwmToken path="/frontend/src/views/ClientSearchView.vue" pos="243:3:3" line-data="    goToClientPage(clientId) {">`clientId`</SwmToken> - The unique identifier of the client.

```
    /**
     * Navigates to the client detail page for the selected client.
     *
     * @param {string} clientId - The unique identifier of the client.
     */
    goToClientPage(clientId) {
      this.$router.push(`/client/${clientId}`);
    },
```

---

</SwmSnippet>

This concludes the walkthrough of the <SwmToken path="/frontend/src/views/ClientSearchView.vue" pos="2:7:7" line-data=" * RetailHub - ClientSearchView.vue">`ClientSearchView`</SwmToken> feature. The component is designed to provide a comprehensive interface for managing clients within <SwmToken path="/frontend/src/views/ClientSearchView.vue" pos="2:3:3" line-data=" * RetailHub - ClientSearchView.vue">`RetailHub`</SwmToken>.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBUmV0YWlsSFVCLUZyb250ZW5kJTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="RetailHUB-Frontend"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
