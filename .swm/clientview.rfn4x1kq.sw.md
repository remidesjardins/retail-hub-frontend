---
title: ClientView
---
# Introduction

This document will walk you through the implementation of the <SwmToken path="/frontend/src/views/ClientView.vue" pos="2:7:7" line-data=" * RetailHub - ClientView.vue">`ClientView`</SwmToken> feature.

The <SwmToken path="/frontend/src/views/ClientView.vue" pos="2:7:7" line-data=" * RetailHub - ClientView.vue">`ClientView`</SwmToken> component displays detailed information about a specific client, including their contact information and a list of recent invoices. It also provides functionality to update client information and navigate between client and invoice views.

We will cover:

1. How the component structure is defined.
2. How client information and sales data are fetched.
3. How client information is updated.
4. How tab navigation is handled.

# Component structure

The <SwmToken path="/frontend/src/views/ClientView.vue" pos="2:7:7" line-data=" * RetailHub - ClientView.vue">`ClientView`</SwmToken> component is defined in <SwmPath>[frontend/src/views/ClientView.vue](/frontend/src/views/ClientView.vue)</SwmPath>. It includes several key sections: the template, props, components, data, methods, and lifecycle hooks.

<SwmSnippet path="/frontend/src/views/ClientView.vue" line="16">

---

The template defines the layout and structure of the component. It includes sections for updating client information, navigation, client details, and recent invoices.

```
<template>
  <div class="invoice-container">
    <!-- UpdateClient Overlay for modifying client details -->
    <UpdateClient
        v-if="showUpdateClient"
        :client="clientCopy"
        @close="closeUpdateClient"
        @close-data="updateClient"
    />
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/ClientView.vue" line="25">

---

The navigation bar and tab buttons allow switching between client and invoice views.

```

    <!-- Navigation Bar -->
    <NavBar/>

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

<SwmSnippet path="/frontend/src/views/ClientView.vue" line="47">

---

The client header section displays the client's name, ID, and address.

```

    <!-- Client Header Section -->
    <div class="client-header">
      <div class="client-info">
        <!-- Display Client Name -->
        <h3>M. {{ client.name }}</h3>
        <!-- Display Client ID -->
        <p>C-{{ client._id }}</p>
        <!-- Display Client Address -->
        <p>{{ client.address }}</p>
      </div>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/ClientView.vue" line="58">

---

The client actions section includes contact information and a button to edit client details.

```

      <div class="client-actions">
        <div class="contact-info">
          <!-- Display Client Phone Number -->
          <p>{{ client.phone }}</p>
          <!-- Display Client Email -->
          <p>{{ client.email }}</p>
        </div>
        <!-- Button to Edit Client Information -->
        <button @click="editClientInfo" class="edit-button">
          <i class="fa fa-pencil-alt"></i>
        </button>
      </div>
    </div>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/ClientView.vue" line="72">

---

The recent invoices section displays a list of invoices related to the client.

```

    <!-- Recent Invoices Section -->
    <div class="recent-invoice-section">
      <!-- InvoiceList Component to display filtered sales -->
      <InvoiceList :sales="filteredSales" />
    </div>
  </div>
</template>
```

---

</SwmSnippet>

# Props and components

<SwmSnippet path="/frontend/src/views/ClientView.vue" line="88">

---

The component accepts a <SwmToken path="/frontend/src/views/ClientView.vue" pos="88:6:6" line-data="  props: [&quot;clientId&quot;],">`clientId`</SwmToken> prop, which is used to fetch client-specific data.

```
  props: ["clientId"],
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/ClientView.vue" line="90">

---

It also includes several child components: <SwmToken path="/frontend/src/views/ClientView.vue" pos="91:1:1" line-data="    NavBar,">`NavBar`</SwmToken>, <SwmToken path="/frontend/src/views/ClientView.vue" pos="92:1:1" line-data="    InvoiceList,">`InvoiceList`</SwmToken>, and <SwmToken path="/frontend/src/views/ClientView.vue" pos="93:1:1" line-data="    UpdateClient,">`UpdateClient`</SwmToken>.

```
  components: {
    NavBar,
    InvoiceList,
    UpdateClient,
  },
```

---

</SwmSnippet>

# Data properties

<SwmSnippet path="/frontend/src/views/ClientView.vue" line="96">

---

The data properties include the client object, sales arrays, and flags for controlling UI elements.

```
  data() {
    return {
      /**
       * Object containing the client's detailed information.
       */
      client: {},

      /**
       * Array of sales (invoices) related to the client.
       */
      filteredSales: [],

      /**
       * Array of all sales fetched from the backend.
       */
      sales: [],

      /**
       * Flag to control the visibility of the UpdateClient overlay.
       */
      showUpdateClient: false,

      /**
       * A copy of the client object used for editing purposes to avoid mutating the original data.
       */
      clientCopy: {},

      /**
       * Currently active tab ('client' or 'invoice').
       */
      activeTab: 'client',
    };
  },
```

---

</SwmSnippet>

# Methods

The methods handle various functionalities such as formatting dates, fetching client information, fetching sales, editing client information, closing the update overlay, updating client data, and switching tabs.

<SwmSnippet path="/frontend/src/views/ClientView.vue" line="131">

---

The <SwmToken path="/frontend/src/views/ClientView.vue" pos="137:1:1" line-data="    formatDate(date) {">`formatDate`</SwmToken> method formats a date string into <SwmToken path="/frontend/src/views/ClientView.vue" pos="132:14:18" line-data="     * Formats a date string into &#39;MM/DD/YYYY&#39; format.">`MM/DD/YYYY`</SwmToken> format.

@param {string} <SwmToken path="/frontend/src/views/ClientView.vue" pos="137:3:3" line-data="    formatDate(date) {">`date`</SwmToken> - The date string to format.\
@returns {string} - The formatted date string.

```
    /**
     * Formats a date string into 'MM/DD/YYYY' format.
     *
     * @param {string} date - The date string to format.
     * @returns {string} - The formatted date string.
     */
    formatDate(date) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(date).toLocaleDateString(undefined, options);
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/ClientView.vue" line="142">

---

The <SwmToken path="/frontend/src/views/ClientView.vue" pos="145:3:3" line-data="    async fetchClientInfo() {">`fetchClientInfo`</SwmToken> method fetches detailed information about the client from the backend API.

```
    /**
     * Fetches detailed information about the client from the backend API.
     */
    async fetchClientInfo() {
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };

      try {
        const response = await fetch(`https://com.servhub.fr/api/customers/${this.clientId}`, requestOptions);
        if (!response.ok) {
          throw new Error(`Failed to fetch client info: ${response.statusText}`);
        }
        const result = await response.json();
        this.client = result;
      } catch (error) {
        console.error(error);
      }
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/ClientView.vue" line="163">

---

The <SwmToken path="/frontend/src/views/ClientView.vue" pos="166:3:3" line-data="    async fetchSales() {">`fetchSales`</SwmToken> method fetches all sales from the backend API and filters them to include only those related to the current client.

```
    /**
     * Fetches all sales from the backend API and filters them to include only those related to the current client.
     */
    async fetchSales() {
      try {
        const response = await fetch('https://com.servhub.fr/api/sales');
        if (!response.ok) {
          throw new Error(`Failed to fetch sales: ${response.statusText}`);
        }
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          this.sales = await Promise.all(
              data.map(async sale => {
                // Check if the sale is associated with the current client
                if (sale.customer_id === this.clientId) {
                  return {
                    _id: sale._id,
                    sale: sale,
                    customer: this.client,
                    total_price: sale.total_price,
                    reference: `I-${sale._id.substring(0, 8)}`,
                  };
                }
                return null; // Exclude sales not related to the client
              })
          );
          // Remove null values resulting from non-matching sales
          this.sales = this.sales.filter(sale => sale !== null);
          this.filteredSales = this.sales; // Initialize with all filtered sales
        }
      } catch (error) {
        console.error('Error fetching sales:', error);
      }
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/ClientView.vue" line="199">

---

The <SwmToken path="/frontend/src/views/ClientView.vue" pos="202:1:1" line-data="    editClientInfo() {">`editClientInfo`</SwmToken> method opens the <SwmToken path="/frontend/src/views/ClientView.vue" pos="200:7:7" line-data="     * Opens the UpdateClient overlay to allow editing of client information.">`UpdateClient`</SwmToken> overlay to allow editing of client information.

```
    /**
     * Opens the UpdateClient overlay to allow editing of client information.
     */
    editClientInfo() {
      this.showUpdateClient = true;
      // Create a copy of the client data to prevent direct mutation
      this.clientCopy = { ...this.client };
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/ClientView.vue" line="208">

---

The <SwmToken path="/frontend/src/views/ClientView.vue" pos="211:1:1" line-data="    closeUpdateClient() {">`closeUpdateClient`</SwmToken> method closes the <SwmToken path="/frontend/src/views/ClientView.vue" pos="209:7:7" line-data="     * Closes the UpdateClient overlay without saving changes.">`UpdateClient`</SwmToken> overlay without saving changes.

```
    /**
     * Closes the UpdateClient overlay without saving changes.
     */
    closeUpdateClient() {
      this.showUpdateClient = false;
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/ClientView.vue" line="215">

---

The <SwmToken path="/frontend/src/views/ClientView.vue" pos="216:23:23" line-data="     * Updates the client data with the modified information from the UpdateClient component.">`UpdateClient`</SwmToken> method updates the client data with the modified information from the <SwmToken path="/frontend/src/views/ClientView.vue" pos="216:23:23" line-data="     * Updates the client data with the modified information from the UpdateClient component.">`UpdateClient`</SwmToken> component.

@param {Object} <SwmToken path="/frontend/src/views/ClientView.vue" pos="220:3:3" line-data="    updateClient(updatedClient) {">`updatedClient`</SwmToken> - The updated client information.

```
    /**
     * Updates the client data with the modified information from the UpdateClient component.
     *
     * @param {Object} updatedClient - The updated client information.
     */
    updateClient(updatedClient) {
      this.showUpdateClient = false; // Close the overlay
      this.client = updatedClient; // Update the client data with the modified information
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/ClientView.vue" line="225">

---

The <SwmToken path="/frontend/src/views/ClientView.vue" pos="231:1:1" line-data="    switchTab(tab) {">`switchTab`</SwmToken> method switches the active tab between 'client' and 'invoice' and redirects to the corresponding view.

@param {string} <SwmToken path="/frontend/src/views/ClientView.vue" pos="231:3:3" line-data="    switchTab(tab) {">`tab`</SwmToken> - The tab to switch to ('client' or 'invoice').

```
    /**
     * Switches the active tab between 'client' and 'invoice'.
     * Redirects to the corresponding view based on the selected tab.
     *
     * @param {string} tab - The tab to switch to ('client' or 'invoice').
     */
    switchTab(tab) {
      this.activeTab = tab;
      if (tab === 'client') {
        this.$router.push({ name: 'ClientSearch' });
      }
      if (tab === 'invoice') {
        this.$router.push({ name: 'InvoiceSearch' });
      }
    },
```

---

</SwmSnippet>

# Lifecycle hooks

<SwmSnippet path="/frontend/src/views/ClientView.vue" line="242">

---

The <SwmToken path="/frontend/src/views/ClientView.vue" pos="242:1:1" line-data="  mounted() {">`mounted`</SwmToken> lifecycle hook fetches client information and related sales when the component is mounted.

```
  mounted() {
    // Fetch client information and related sales when the component is mounted
    this.fetchClientInfo();
    this.fetchSales();
  }
```

---

</SwmSnippet>

This concludes the walkthrough of the <SwmToken path="/frontend/src/views/ClientView.vue" pos="2:7:7" line-data=" * RetailHub - ClientView.vue">`ClientView`</SwmToken> feature. The implementation ensures that client information is displayed and managed effectively, with clear navigation and update functionalities.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBUmV0YWlsSFVCLUZyb250ZW5kJTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="RetailHUB-Frontend"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
