---
title: ClientSearchOverlay
---
# Introduction

This document will walk you through the implementation of the <SwmToken path="/frontend/src/components/ClientSearchOverlay.vue" pos="4:4:4" line-data="  File: ClientSearchOverlay.vue">`ClientSearchOverlay`</SwmToken> component in the <SwmToken path="/frontend/src/components/ClientSearchOverlay.vue" pos="3:4:4" line-data="  Project: RetailHub">`RetailHub`</SwmToken> project.

The component is located at: <SwmPath>[frontend/src/components/ClientSearchOverlay.vue](/frontend/src/components/ClientSearchOverlay.vue)</SwmPath>

We will cover:

1. The structure and layout of the component.
2. The data and methods used for client search functionality.
3. The interaction with the parent component.

# Component structure and layout

The <SwmToken path="/frontend/src/components/ClientSearchOverlay.vue" pos="4:4:4" line-data="  File: ClientSearchOverlay.vue">`ClientSearchOverlay`</SwmToken> component provides a user interface for searching and managing clients. The overlay darkens the background and focuses on the client search modal.

<SwmSnippet path="/frontend/src/components/ClientSearchOverlay.vue" line="14">

---

The main structure includes:

- An overlay container.
- A close button to exit the overlay.
- A search form with input fields for last name, first name, phone number, and email.
- A list to display filtered clients.
- A button to open the Create Client modal.

```
<template>
  <!-- Overlay container to darken the background and focus on the client search modal -->
  <div class="overlay-container">
    <div class="overlay">
      <!-- Close button to exit the client search overlay -->
      <button class="close-button" @click="closeClientSearch">
        <i class="fa-solid fa-xmark"></i>
      </button>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ClientSearchOverlay.vue" line="22">

---

The search form allows users to filter clients based on various criteria. Each input field is bound to a property in the <SwmToken path="/frontend/src/components/ClientSearchOverlay.vue" pos="25:3:3" line-data="        &lt;!-- Search Form for filtering clients --&gt;">`Search`</SwmToken> object.

```

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
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ClientSearchOverlay.vue" line="62">

---

The filtered clients are displayed in a list. If no clients match the search criteria, a message is shown.

```

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
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ClientSearchOverlay.vue" line="86">

---

A button is provided to open the Create Client modal, allowing users to add new clients.

```

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
```

---

</SwmSnippet>

# Data and methods

The component uses several data properties and methods to manage its state and functionality.

## Data properties

<SwmSnippet path="/frontend/src/components/ClientSearchOverlay.vue" line="114">

---

The <SwmToken path="/frontend/src/components/ClientSearchOverlay.vue" pos="114:1:1" line-data="  data() {">`data`</SwmToken> function returns an object containing:

- <SwmToken path="/frontend/src/components/ClientSearchOverlay.vue" pos="119:1:1" line-data="      activeTab: &#39;client&#39;,">`activeTab`</SwmToken>: The currently active tab in the overlay.
- <SwmToken path="/frontend/src/components/ClientSearchOverlay.vue" pos="15:25:25" line-data="  &lt;!-- Overlay container to darken the background and focus on the client search modal --&gt;">`search`</SwmToken>: An object holding the search criteria entered by the user.
- <SwmToken path="/frontend/src/components/ClientSearchOverlay.vue" pos="25:11:11" line-data="        &lt;!-- Search Form for filtering clients --&gt;">`clients`</SwmToken>: An array storing all clients fetched from the API.
- <SwmToken path="/frontend/src/components/ClientSearchOverlay.vue" pos="94:6:6" line-data="          v-if=&quot;showCreateClient&quot;">`showCreateClient`</SwmToken>: A boolean flag to control the visibility of the Create Client modal.

```
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
```

---

</SwmSnippet>

## Computed properties

<SwmSnippet path="/frontend/src/components/ClientSearchOverlay.vue" line="142">

---

The <SwmToken path="/frontend/src/components/ClientSearchOverlay.vue" pos="27:10:10" line-data="          &lt;form @submit.prevent=&quot;filteredClients&quot;&gt;">`filteredClients`</SwmToken> computed property filters the list of clients based on the search criteria.

@returns {Array} An array of clients that match the search criteria.

```
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
```

---

</SwmSnippet>

## Methods

Several methods are defined to handle various actions within the component.

### Fetching clients

<SwmSnippet path="/frontend/src/components/ClientSearchOverlay.vue" line="172">

---

The <SwmToken path="/frontend/src/components/ClientSearchOverlay.vue" pos="175:1:1" line-data="    fetchInitialClients() {">`fetchInitialClients`</SwmToken> method fetches the initial list of clients from the API when the component is mounted.

```
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
```

---

</SwmSnippet>

### Normalizing phone numbers

<SwmSnippet path="/frontend/src/components/ClientSearchOverlay.vue" line="189">

---

The <SwmToken path="/frontend/src/components/ClientSearchOverlay.vue" pos="159:3:3" line-data="            this.normalizePhoneNumber(client.phone).includes(">`normalizePhoneNumber`</SwmToken> method removes all <SwmToken path="/frontend/src/components/ClientSearchOverlay.vue" pos="190:17:19" line-data="     * Normalizes a phone number by removing all non-digit characters.">`non-digit`</SwmToken> characters from a phone number.

@param {string} <SwmToken path="/frontend/src/components/ClientSearchOverlay.vue" pos="194:3:3" line-data="    normalizePhoneNumber(phoneNumber) {">`phoneNumber`</SwmToken> - The phone number to normalize.\
@returns {string} The normalized phone number containing only digits.

```
    /**
     * Normalizes a phone number by removing all non-digit characters.
     * @param {string} phoneNumber - The phone number to normalize.
     * @returns {string} The normalized phone number containing only digits.
     */
    normalizePhoneNumber(phoneNumber) {
      return phoneNumber.replace(/\D/g, '');
    },
```

---

</SwmSnippet>

### Managing the Create Client modal

<SwmSnippet path="/frontend/src/components/ClientSearchOverlay.vue" line="198">

---

The <SwmToken path="/frontend/src/components/ClientSearchOverlay.vue" pos="88:18:18" line-data="          &lt;button class=&quot;create-client-btn&quot; @click=&quot;openCreateClient&quot;&gt;Create client&lt;/button&gt;">`openCreateClient`</SwmToken> and <SwmToken path="/frontend/src/components/ClientSearchOverlay.vue" pos="95:5:5" line-data="          @close=&quot;closeCreateClient&quot;">`closeCreateClient`</SwmToken> methods control the visibility of the Create Client modal.

```
    /**
     * Opens the Create Client modal by setting the corresponding flag to true.
     */
    openCreateClient() {
      this.showCreateClient = true;
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ClientSearchOverlay.vue" line="205">

---

```
    /**
     * Closes the Create Client modal by setting the corresponding flag to false.
     */
    closeCreateClient() {
      this.showCreateClient = false;
    },
```

---

</SwmSnippet>

### Closing the overlay

<SwmSnippet path="/frontend/src/components/ClientSearchOverlay.vue" line="212">

---

The <SwmToken path="/frontend/src/components/ClientSearchOverlay.vue" pos="19:16:16" line-data="      &lt;button class=&quot;close-button&quot; @click=&quot;closeClientSearch&quot;&gt;">`closeClientSearch`</SwmToken> method emits a 'close' event to the parent component to close the overlay.

```
    /**
     * Closes the Client Search overlay by emitting a 'close' event to the parent component.
     */
    closeClientSearch() {
      this.$emit("close");
    },
```

---

</SwmSnippet>

### Selecting a client

<SwmSnippet path="/frontend/src/components/ClientSearchOverlay.vue" line="219">

---

The <SwmToken path="/frontend/src/components/ClientSearchOverlay.vue" pos="75:5:5" line-data="              @click=&quot;chooseClient(client)&quot;">`chooseClient`</SwmToken> method emits the selected client's data to the parent component.

@param {Object} <SwmToken path="/frontend/src/components/ClientSearchOverlay.vue" pos="223:3:3" line-data="    chooseClient(client) {">`client`</SwmToken> - The client object that was selected.

```
    /**
     * Selects a client and emits the selected client's data to the parent component.
     * @param {Object} client - The client object that was selected.
     */
    chooseClient(client) {
      this.$emit("close-data", client);
    },
```

---

</SwmSnippet>

# Interaction with parent component

<SwmSnippet path="/frontend/src/components/ClientSearchOverlay.vue" line="227">

---

When the component is mounted, it fetches the initial list of clients.

```
  mounted() {
    // Fetch the initial list of clients when the component is mounted
    this.fetchInitialClients();
  },
```

---

</SwmSnippet>

The component also emits events to the parent component to handle closing the overlay and selecting a client.

This concludes the walkthrough of the <SwmToken path="/frontend/src/components/ClientSearchOverlay.vue" pos="4:4:4" line-data="  File: ClientSearchOverlay.vue">`ClientSearchOverlay`</SwmToken> component. The implementation focuses on providing a user-friendly interface for searching and managing clients within the <SwmToken path="/frontend/src/components/ClientSearchOverlay.vue" pos="3:4:4" line-data="  Project: RetailHub">`RetailHub`</SwmToken> project.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBUmV0YWlsSFVCLUZyb250ZW5kJTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="RetailHUB-Frontend"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
