---
title: InvoiceSearchView
---
# Introduction

This document will walk you through the implementation of the <SwmToken path="/frontend/src/views/InvoiceSearchView.vue" pos="2:7:7" line-data=" * RetailHub - InvoiceSearchView.vue">`InvoiceSearchView`</SwmToken> component.

The component provides an interface for searching and viewing invoices within <SwmToken path="/frontend/src/views/InvoiceSearchView.vue" pos="2:3:3" line-data=" * RetailHub - InvoiceSearchView.vue">`RetailHub`</SwmToken>. Users can search for invoices by client name or invoice reference and view the list of filtered invoices. It includes navigation tabs to switch between client and invoice views.

We will cover:

1. The structure of the component.
2. The data properties and their roles.
3. The methods used for fetching and filtering data.
4. The tab switching functionality.

# Component structure

<SwmSnippet path="/frontend/src/views/InvoiceSearchView.vue" line="15">

---

The <SwmToken path="/frontend/src/views/InvoiceSearchView.vue" pos="2:7:7" line-data=" * RetailHub - InvoiceSearchView.vue">`InvoiceSearchView`</SwmToken> component is defined in <SwmPath>[frontend/src/views/InvoiceSearchView.vue](/frontend/src/views/InvoiceSearchView.vue)</SwmPath>. It includes a navigation bar, tab buttons for switching views, a search header, and a list of filtered invoices.

```
<template>
  <div class="invoice-search">
    <!-- Navigation Bar -->
    <NavBar />

    <!-- Top Section containing tab buttons and search header -->
    <div class="top-section">
      <!-- Top Bar with Tab Buttons -->
      <div class="top-bar">
        <!-- Client Tab Button -->
        <button
            :class="{ active: activeTab === 'client' }"
            @click="switchTab('client')"
        >
          Client
        </button>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/InvoiceSearchView.vue" line="31">

---

The tab buttons allow users to switch between viewing invoices and clients.

```

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

<SwmSnippet path="/frontend/src/views/InvoiceSearchView.vue" line="40">

---

The search functionality is provided by the <SwmToken path="/frontend/src/views/InvoiceSearchView.vue" pos="41:3:3" line-data="      &lt;!-- Header Component for Search Functionality --&gt;">`Header`</SwmToken> component, and the list of filtered invoices is displayed using the <SwmToken path="/frontend/src/views/InvoiceSearchView.vue" pos="47:3:3" line-data="      &lt;!-- InvoiceList Component displaying filtered sales --&gt;">`InvoiceList`</SwmToken> component.

```

      <!-- Header Component for Search Functionality -->
      <Header :searchQuery="searchQuery" @search="searchSales" id="header" />
    </div>

    <!-- Recent Sales Section displaying the list of invoices -->
    <div class="recent-sales">
      <!-- InvoiceList Component displaying filtered sales -->
      <InvoiceList :sales="filteredSales"></InvoiceList>
    </div>
  </div>
</template>
```

---

</SwmSnippet>

# Component registration

<SwmSnippet path="/frontend/src/views/InvoiceSearchView.vue" line="59">

---

The <SwmToken path="/frontend/src/views/InvoiceSearchView.vue" pos="60:1:1" line-data="    Header,">`Header`</SwmToken>, <SwmToken path="/frontend/src/views/InvoiceSearchView.vue" pos="61:1:1" line-data="    InvoiceList,">`InvoiceList`</SwmToken>, and <SwmToken path="/frontend/src/views/InvoiceSearchView.vue" pos="62:1:1" line-data="    NavBar,">`NavBar`</SwmToken> components are registered locally within the <SwmToken path="/frontend/src/views/InvoiceSearchView.vue" pos="2:7:7" line-data=" * RetailHub - InvoiceSearchView.vue">`InvoiceSearchView`</SwmToken> component.

```
  components: {
    Header,
    InvoiceList,
    NavBar,
  },
```

---

</SwmSnippet>

# Data properties

The component maintains several data properties to manage the state of the search and the active tab.

<SwmSnippet path="/frontend/src/views/InvoiceSearchView.vue" line="65">

---

The <SwmToken path="/frontend/src/views/InvoiceSearchView.vue" pos="72:1:1" line-data="      searchQuery: &#39;&#39;,">`searchQuery`</SwmToken> property holds the current search query entered by the user.

```
  data() {
    return {
      /**
       * The current search query entered by the user.
       * Used to filter the list of invoices.
       * @type {string}
       */
      searchQuery: '',
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/InvoiceSearchView.vue" line="73">

---

The <SwmToken path="/frontend/src/views/InvoiceSearchView.vue" pos="79:1:1" line-data="      activeTab: &#39;invoice&#39;,">`activeTab`</SwmToken> property determines which view (client or invoice) is currently active.

```

      /**
       * The currently active tab ('client' or 'invoice').
       * Determines which view is active.
       * @type {string}
       */
      activeTab: 'invoice',
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/InvoiceSearchView.vue" line="80">

---

The <SwmToken path="/frontend/src/views/InvoiceSearchView.vue" pos="82:11:11" line-data="       * Array holding all fetched sales data from the backend.">`sales`</SwmToken> array holds all fetched sales data from the backend, while the <SwmToken path="/frontend/src/views/InvoiceSearchView.vue" pos="91:1:1" line-data="      filteredSales: [],">`filteredSales`</SwmToken> array holds the sales data filtered based on the search query.

```

      /**
       * Array holding all fetched sales data from the backend.
       * @type {Array}
       */
      sales: [],

      /**
       * Array holding the filtered sales based on the search query.
       * @type {Array}
       */
      filteredSales: [],
    };
  },
```

---

</SwmSnippet>

# Fetching sales data

<SwmSnippet path="/frontend/src/views/InvoiceSearchView.vue" line="96">

---

The <SwmToken path="/frontend/src/views/InvoiceSearchView.vue" pos="103:3:3" line-data="    async fetchSales() {">`fetchSales`</SwmToken> method fetches all sales data from the backend API, processes each sale to include customer details, and formats the reference. It updates the <SwmToken path="/frontend/src/views/InvoiceSearchView.vue" pos="97:7:7" line-data="     * Fetches all sales data from the backend API.">`sales`</SwmToken> and <SwmToken path="/frontend/src/views/InvoiceSearchView.vue" pos="99:11:11" line-data="     * Updates the sales and filteredSales arrays with the fetched data.">`filteredSales`</SwmToken> arrays with the fetched data.

@async

```
    /**
     * Fetches all sales data from the backend API.
     * Processes each sale to include customer details and formats the reference.
     * Updates the sales and filteredSales arrays with the fetched data.
     *
     * @async
     */
    async fetchSales() {
      try {
        const response = await fetch('https://com.servhub.fr/api/sales');
        const data = await response.json();
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/InvoiceSearchView.vue" line="107">

---

The method processes each sale to include customer details and formats the reference.

```

        if (Array.isArray(data) && data.length > 0) {
          // Process each sale to include customer details and formatted reference
          this.sales = await Promise.all(
              data.map(async sale => {
                const customer = await this.fetchCustomer(sale.customer_id);
                return {
                  _id: sale._id,
                  sale: sale,
                  customer: customer,
                  total_price: sale.total_price,
                  reference: `I-${sale._id.substring(0, 8)}`,
                };
              })
          );
          this.filteredSales = this.sales; // Initially, display all sales
        }
      } catch (error) {
        console.error('Error fetching sales:', error);
      }
    },
```

---

</SwmSnippet>

# Filtering sales data

<SwmSnippet path="/frontend/src/views/InvoiceSearchView.vue" line="129">

---

The <SwmToken path="/frontend/src/views/InvoiceSearchView.vue" pos="135:1:1" line-data="    searchSales(query) {">`searchSales`</SwmToken> method filters the sales based on the provided search query. The search matches against the client's name and the invoice reference.

@param {string} <SwmToken path="/frontend/src/views/InvoiceSearchView.vue" pos="135:3:3" line-data="    searchSales(query) {">`query`</SwmToken> - The search query entered by the user.

```
    /**
     * Filters the sales based on the provided search query.
     * The search matches against the client's name and the invoice reference.
     *
     * @param {string} query - The search query entered by the user.
     */
    searchSales(query) {
      const lowerQuery = query.toLowerCase();
      this.filteredSales = this.sales.filter(
          sale =>
              sale.customer.name.toLowerCase().includes(lowerQuery) ||
              sale.reference.toLowerCase().includes(lowerQuery)
      );
    },
```

---

</SwmSnippet>

# Fetching customer details

<SwmSnippet path="/frontend/src/views/InvoiceSearchView.vue" line="144">

---

The <SwmToken path="/frontend/src/views/InvoiceSearchView.vue" pos="112:11:11" line-data="                const customer = await this.fetchCustomer(sale.customer_id);">`fetchCustomer`</SwmToken> method fetches customer details based on the provided customer ID from the backend API.

@param {string} <SwmToken path="/frontend/src/views/InvoiceSearchView.vue" pos="150:5:5" line-data="    async fetchCustomer(customer_id) {">`customer_id`</SwmToken> - The unique identifier of the customer.\
@returns {Promise<Object|null>} - The customer data object or null if an error occurs.

```
    /**
     * Fetches customer details based on the provided customer ID from the backend API.
     *
     * @param {string} customer_id - The unique identifier of the customer.
     * @returns {Promise<Object|null>} - The customer data object or null if an error occurs.
     */
    async fetchCustomer(customer_id) {
      try {
        const response = await fetch(`https://com.servhub.fr/api/customers/${customer_id}`);
        const customerData = await response.json();
        return customerData;
      } catch (error) {
        console.error('Error fetching customer details:', error);
        return null;
      }
    },
```

---

</SwmSnippet>

# Tab switching functionality

<SwmSnippet path="/frontend/src/views/InvoiceSearchView.vue" line="161">

---

The <SwmToken path="/frontend/src/views/InvoiceSearchView.vue" pos="27:5:5" line-data="            @click=&quot;switchTab(&#39;client&#39;)&quot;">`switchTab`</SwmToken> method switches the active tab between 'client' and 'invoice' and navigates to the corresponding view based on the selected tab.

@param {string} <SwmToken path="/frontend/src/views/InvoiceSearchView.vue" pos="167:3:3" line-data="    switchTab(tab) {">`tab`</SwmToken> - The tab to switch to ('client' or 'invoice').

```
    /**
     * Switches the active tab between 'client' and 'invoice'.
     * Navigates to the corresponding view based on the selected tab.
     *
     * @param {string} tab - The tab to switch to ('client' or 'invoice').
     */
    switchTab(tab) {
      this.activeTab = tab;
      if (tab === 'client') {
        this.$router.push({ name: 'ClientSearch' });
      }
    },
```

---

</SwmSnippet>

# Component lifecycle

<SwmSnippet path="/frontend/src/views/InvoiceSearchView.vue" line="175">

---

The <SwmToken path="/frontend/src/views/InvoiceSearchView.vue" pos="176:17:17" line-data="   * Lifecycle hook called when the component is mounted.">`mounted`</SwmToken> lifecycle hook initiates the fetching of sales data when the component is mounted.

```
  /**
   * Lifecycle hook called when the component is mounted.
   * Initiates fetching of sales data.
   */
  mounted() {
    this.fetchSales();
  },
```

---

</SwmSnippet>

This concludes the walkthrough of the <SwmToken path="/frontend/src/views/InvoiceSearchView.vue" pos="2:7:7" line-data=" * RetailHub - InvoiceSearchView.vue">`InvoiceSearchView`</SwmToken> component. The design decisions and methods implemented ensure that users can efficiently search and view invoices within <SwmToken path="/frontend/src/views/InvoiceSearchView.vue" pos="2:3:3" line-data=" * RetailHub - InvoiceSearchView.vue">`RetailHub`</SwmToken>.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBUmV0YWlsSFVCLUZyb250ZW5kJTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="RetailHUB-Frontend"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
