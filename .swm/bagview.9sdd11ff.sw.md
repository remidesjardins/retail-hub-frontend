---
title: BagView
---
# Introduction

This document will walk you through the implementation of the <SwmToken path="/frontend/src/views/BagView.vue" pos="2:7:7" line-data=" * RetailHub - BagView.vue">`BagView`</SwmToken> feature in the <SwmToken path="/frontend/src/views/BagView.vue" pos="2:3:3" line-data=" * RetailHub - BagView.vue">`RetailHub`</SwmToken> application.

The feature allows users to view, modify, and proceed with their cart items, handle client selection, and integrate <SwmToken path="/frontend/src/views/BagView.vue" pos="12:17:17" line-data=" * It also handles client selection and integrates PayPal for payments.">`PayPal`</SwmToken> for payments.

We will cover:

1. How the <SwmToken path="/frontend/src/views/BagView.vue" pos="2:7:7" line-data=" * RetailHub - BagView.vue">`BagView`</SwmToken> component is structured.
2. How cart items are managed.
3. How client selection is handled.
4. How the <SwmToken path="/frontend/src/views/BagView.vue" pos="12:17:17" line-data=" * It also handles client selection and integrates PayPal for payments.">`PayPal`</SwmToken> integration is implemented.

# Component structure

<SwmSnippet path="/frontend/src/views/BagView.vue" line="1">

---

The <SwmToken path="/frontend/src/views/BagView.vue" pos="2:7:7" line-data=" * RetailHub - BagView.vue">`BagView`</SwmToken> component is located at <SwmPath>[frontend/src/views/BagView.vue](/frontend/src/views/BagView.vue)</SwmPath>. It manages the shopping bag view, allowing users to interact with their cart and proceed to payment.

```
<!--
 * RetailHub - BagView.vue
 *
 * Participants:
 * - Alexandre Borny
 * - Maël Castellan
 * - Laura Donato
 * - Rémi Desjardins
 *
 * This component manages the shopping bag view in RetailHub,
 * allowing users to view, modify, and proceed with their cart items.
 * It also handles client selection and integrates PayPal for payments.
 -->
```

---

</SwmSnippet>

# Template structure

<SwmSnippet path="/frontend/src/views/BagView.vue" line="15">

---

The template defines the layout and structure of the <SwmToken path="/frontend/src/views/BagView.vue" pos="2:7:7" line-data=" * RetailHub - BagView.vue">`BagView`</SwmToken>. It includes the client search overlay, navigation bar, shopping bag section, and summary section.

```
<template>
  <div class="home-container">
    <!-- Client Search Overlay for selecting or modifying client details -->
    <ClientSearchOverlay
        v-if="showClientSearch"
        @close="closeClientOverlay"
        @close-data="closeClientOverlayWithData"
    />
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/BagView.vue" line="23">

---

The shopping bag section displays the cart items and allows users to modify quantities or remove items.

```

    <!-- Navigation Bar -->
    <NavBar class="navbar"></NavBar>

    <div class="content">
      <div class="cart-page">
        <div class="cart-container">
          <!-- Shopping Bag Section -->
          <div class="bag">
            <h2>Bag</h2>
            <!-- Transition group to handle removal animation of cart items -->
            <transition-group name="snap" tag="div">
              <div
                  v-for="(product, index) in cartProducts.slice()"
                  :key="index"
                  class="cart-item"
              >
                <!-- Product Image -->
                <img :src="product.product.Image" alt="Product image" />
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/BagView.vue" line="42">

---

Each cart item includes details such as the product name, SKU, quantity selector, and total price.

```

                <div class="item-details">
                  <div class="details-left">
                    <!-- Product Name -->
                    <h3>{{ product.product.name }}</h3>
                    <!-- Product SKU -->
                    <p>{{ product.product.SKU }}</p>
                  </div>

                  <!-- Quantity Selector -->
                  <div class="quantity-selector">
                    <button @click="decreaseQuantity(index, product)">-</button>
                    <span>{{ product.quantity }}</span>
                    <button @click="increaseQuantity(index, product)">+</button>
                  </div>

                  <!-- Total Price for the Product -->
                  <span>
                    {{ (product.product.price * product.quantity).toFixed(2) }} $
                    <!-- Trash Icon to Remove Product from Cart -->
                    <i class="fa-solid fa-trash" @click="deleteProductFromCart(product)"></i>
                  </span>
                </div>
              </div>
            </transition-group>
          </div>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/BagView.vue" line="68">

---

The summary section shows the subtotal, tax, and total amount. It also includes a button to open the client overlay and a <SwmToken path="/frontend/src/views/BagView.vue" pos="83:3:3" line-data="            &lt;!-- PayPal Button Container, visible only when a client is identified --&gt;">`PayPal`</SwmToken> button container.

```

          <!-- Summary Section -->
          <div class="summary">
            <!-- Button to Open Client Overlay for Client Selection/Modification -->
            <button @click="openClientOverlay">{{ clientName }}</button>

            <div class="totals">
              <!-- Display Sub-total -->
              <p>Sub-total: {{ subtotal }} $</p>
              <!-- Display Tax -->
              <p>Tax: {{ tax }} $</p>
              <!-- Display Total Amount -->
              <h2>Total: {{ total }} $</h2>
            </div>

            <!-- PayPal Button Container, visible only when a client is identified -->
            <div id="paypal-button-container" v-show="clientName !== 'Identity your client'"></div>

            <!-- Button to Transfer Invoice (Currently Hidden) -->
            <button @click="transferInvoice" v-show="false">Transfer the invoice</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

---

</SwmSnippet>

# Component registration

<SwmSnippet path="/frontend/src/views/BagView.vue" line="101">

---

The <SwmToken path="/frontend/src/views/BagView.vue" pos="102:1:1" line-data="    NavBar,">`NavBar`</SwmToken> and <SwmToken path="/frontend/src/views/BagView.vue" pos="103:1:1" line-data="    ClientSearchOverlay,">`ClientSearchOverlay`</SwmToken> components are registered for use within the <SwmToken path="/frontend/src/views/BagView.vue" pos="2:7:7" line-data=" * RetailHub - BagView.vue">`BagView`</SwmToken> component.

```
  components: {
    NavBar,
    ClientSearchOverlay,
  },
```

---

</SwmSnippet>

# Data properties

<SwmSnippet path="/frontend/src/views/BagView.vue" line="106">

---

The data properties include the cart products, tax rate, client details, and payment information.

```
  data() {
    return {
      /**
       * Array of products in the shopping cart.
       * Each product includes product details and quantity.
       */
      cartProducts: [],

      /**
       * Tax rate applied to the subtotal.
       * Example: 7.25% tax rate.
       */
      taxRate: 0.0725,

      /**
       * Flag to control the visibility of the client search overlay.
       */
      showClientSearch: false,

      /**
       * Object containing client details.
       */
      client: undefined,

      /**
       * Name of the client. Defaults to prompting user to identify the client.
       */
      clientName: "Identity your client",

      /**
       * Status of the payment (e.g., "Completed", "Failed").
       */
      paymentStatus: "",

      /**
       * Payment method used. Currently set to "PayPal".
       */
      paymentMethod: "PayPal",

      /**
       * PayPal payment ID received after a successful transaction.
       */
      paymentID: "",
    };
  },
```

---

</SwmSnippet>

# Computed properties

<SwmSnippet path="/frontend/src/views/BagView.vue" line="152">

---

The computed properties calculate the subtotal, tax, and total amount based on the cart products and tax rate.

```
  computed: {
    /**
     * Calculates the subtotal of all products in the cart.
     *
     * @returns {string} - The subtotal amount formatted to two decimal places.
     */
    subtotal() {
      let total = 0;
      this.cartProducts.forEach(productOrList => {
        if (Array.isArray(productOrList)) {
          productOrList.forEach(product => {
            if (product.product.price) {
              total += parseFloat(product.quantity) * parseFloat(product.product.price);
            }
          });
        } else {
          if (productOrList.product.price) {
            total += parseFloat(productOrList.quantity) * parseFloat(productOrList.product.price);
          }
        }
      });
      return total.toFixed(2);
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/BagView.vue" line="176">

---

This code calculates the tax amount based on the <SwmToken path="/frontend/src/views/BagView.vue" pos="182:6:6" line-data="      return (this.subtotal * this.taxRate).toFixed(2);">`subtotal`</SwmToken> and <SwmToken path="/frontend/src/views/BagView.vue" pos="182:12:12" line-data="      return (this.subtotal * this.taxRate).toFixed(2);">`taxRate`</SwmToken> properties of the object. It returns the tax amount formatted to two decimal places.

```
    /**
     * Calculates the tax based on the subtotal and tax rate.
     *
     * @returns {string} - The tax amount formatted to two decimal places.
     */
    tax() {
      return (this.subtotal * this.taxRate).toFixed(2);
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/BagView.vue" line="185">

---

This code snippet calculates the total amount including tax.

```
    /**
     * Calculates the total amount including tax.
     *
     * @returns {string} - The total amount formatted to two decimal places.
     */
    total() {
      return (parseFloat(this.subtotal) + parseFloat(this.tax)).toFixed(2);
    }
  },
```

---

</SwmSnippet>

# Methods

The methods handle various actions such as loading cart products, transferring invoices, and managing <SwmToken path="/frontend/src/views/BagView.vue" pos="12:17:17" line-data=" * It also handles client selection and integrates PayPal for payments.">`PayPal`</SwmToken> transactions.

<SwmSnippet path="/frontend/src/views/BagView.vue" line="196">

---

The <SwmToken path="/frontend/src/views/BagView.vue" pos="199:1:1" line-data="    loadCartProducts() {">`loadCartProducts`</SwmToken> method loads the cart products from the Vuex store.

```
    /**
     * Loads the cart products from the Vuex store and reverses the order.
     */
    loadCartProducts() {
      this.cartProducts = this.$store.state.bagContents.reverse();
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/BagView.vue" line="203">

---

The <SwmToken path="/frontend/src/views/BagView.vue" pos="207:3:3" line-data="    async transferInvoice() {">`transferInvoice`</SwmToken> method handles the process of creating a sale record and generating a <SwmToken path="/frontend/src/views/BagView.vue" pos="204:25:25" line-data="     * Transfers the invoice by creating a sale record and generating a PayPal invoice.">`PayPal`</SwmToken> invoice.

```
    /**
     * Transfers the invoice by creating a sale record and generating a PayPal invoice.
     * Handles the entire process of payment and invoice generation.
     */
    async transferInvoice() {
      try {
        // Retrieve PayPal access token
        const accessToken = await this.getAccessToken();

        // Split the client address into components
        const addressParts = this.client.address.split(","); // Format: "Street, City, State, PostalCode, Country"
        const addressLine1 = addressParts[0] ? addressParts[0].trim() : "";
        const city = addressParts[1] ? addressParts[1].trim() : "";
        const state = addressParts[2] ? addressParts[2].trim() : "";
        const postalCode = addressParts[3] ? addressParts[3].trim() : "";
        const country = addressParts[4] ? addressParts[4].trim() : "";

        // Step 1: Send the sale data to the server for each product
        for (const product of this.cartProducts) {
          await this.$store.dispatch("handleReceipt", { payload: product.product, number: product.quantity });
        }

        // Clear the cart after processing
        this.$store.commit("removeAllFromCart");

        // Redirect to the Sale page
        this.$router.push({ name: "Sale" });

        // Prepare products data for the sale record
        const products = this.cartProducts.map(product => ({
          SKU: product.product.SKU,
          name: product.product.name,
          quantity: product.quantity,
          price_per_unit: product.product.price
        }));

        const total_price = this.total;
        const client_name = `${this.client.firstName} ${this.client.lastName}`;

        // Create a new sale record in the backend
        const saleResponse = await fetch("https://com.servhub.fr/api/sales/", {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({
            products,
            total_price,
            customer_id: this.client._id,
            payment_status: this.paymentStatus,
            payment_method: this.paymentMethod,
            soldBy: "66fdffb56790cc1514a6a267" // Example seller ID
          }),
          redirect: "follow"
        });

        const saleResult = await saleResponse.json();
        console.log("Sale created:", saleResult);

        // Step 2: Generate PayPal Invoice after payment is confirmed
        const invoicePayload = {
          detail: {
            currency_code: "CAD",
            invoice_number: `INV-${new Date().getTime()}`,
            reference: "order-ref",
            invoice_date: new Date().toISOString().split("T")[0],
            note: "Thank you for your purchase.",
            payment_term: {
              term_type: "NO_DUE_DATE", // No due date as the invoice is already paid
            },
            payment_detail: {
              type: "PAYPAL", // Mark as paid via PayPal
              transaction_id: this.paymentID,
              method: "PayPal" // Payment method
            }
          },
          invoicer: {
            name: {
              given_name: "RetailHub Corporation",
              surname: "RetailHub"
            },
            address: {
              address_line_1: "777 boulevard Robert Bourassa",
              admin_area_2: "Montréal",
              admin_area_1: "Québec",
              postal_code: "H3C 3Z7",
              country_code: "CA"
            },
            email_address: "sb-qglh933109622@business.example.com"
          },
          primary_recipients: [
            {
              billing_info: {
                name: {
                  given_name: this.client.firstName,
                  surname: this.client.lastName
                },
                address: {
                  address_line_1: addressLine1,
                  admin_area_2: city,
                  admin_area_1: state,
                  postal_code: postalCode,
                  country_code: "CA"
                },
                email_address: this.client.email
              }
            }
          ],
          items: products.map(product => ({
            name: product.name,
            description: product.Details || "Product",
            quantity: product.quantity,
            unit_amount: {
              currency_code: "CAD",
              value: product.price_per_unit
            },
            tax: {
              name: "Sales Tax",
              amount: {
                currency_code: "CAD",
                value: ((product.price_per_unit * product.quantity) * 0.0725).toFixed(2) // Tax value for each item
              },
              percent: "7.25"
            }
          })),
          amount: {
            breakdown: {
              item_total: {
                currency_code: "CAD",
                value: this.subtotal
              },
              tax_total: {
                currency_code: "CAD",
                value: products.reduce((sum, product) => {
                  return sum + ((product.price_per_unit * product.quantity) * 0.0725);
                }, 0).toFixed(2) // Sum up tax for each product
              }
            },
            total: {
              currency_code: "CAD",
              value: this.total
            },
            paid_amount: { // Specify that the full amount has been paid
              currency_code: "CAD",
              value: this.total // Mark the total as the paid amount
            }
          }
        };

        // Create the invoice in PayPal
        const invoiceResponse = await fetch('https://api-m.sandbox.paypal.com/v2/invoicing/invoices', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(invoicePayload)
        });

        const invoiceResult = await invoiceResponse.json();
        console.log("Invoice created:", invoiceResult);

        if (invoiceResult.href) {
          // Step 3: Fetch Invoice Details using the self link
          const invoiceDetailsResponse = await fetch(invoiceResult.href, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          });

          const invoiceDetails = await invoiceDetailsResponse.json();

          // Send the invoice to the recipient
          const sendInvoiceResponse = await fetch(`https://api-m.sandbox.paypal.com/v2/invoicing/invoices/${invoiceDetails.id}/send`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          });

          const sendInvoiceResult = await sendInvoiceResponse.json();
          console.log("Invoice sent:", sendInvoiceResult);

          // Step 4: Open recipient view URL
          const invoiceMetadata = invoiceDetails.detail.metadata;
          const recipientViewURL = invoiceMetadata.recipient_view_url;
          console.log("Recipient View URL:", recipientViewURL);
          window.open(recipientViewURL);
        }

      } catch (error) {
        console.error("Error creating invoice:", error);
      }
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/BagView.vue" line="399">

---

The <SwmToken path="/frontend/src/views/BagView.vue" pos="405:3:3" line-data="    async getAccessToken() {">`getAccessToken`</SwmToken> method retrieves the <SwmToken path="/frontend/src/views/BagView.vue" pos="400:7:7" line-data="     * Retrieves the PayPal access token using client credentials.">`PayPal`</SwmToken> access token using client credentials.

@returns {Promise<string>} - The access token for PayPal API.\
@throws {Error} - If unable to fetch the access token.

```
    /**
     * Retrieves the PayPal access token using client credentials.
     *
     * @returns {Promise<string>} - The access token for PayPal API.
     * @throws {Error} - If unable to fetch the access token.
     */
    async getAccessToken() {
      const clientID = "AZARWGYIQ1t8j1JqA2s-3G4ttRXc-uivXrk31VcVFnuQHMADwtmhEHRaHe7F_WAgZbp5UZO7mnnvPHyM"; // Replace with your actual sandbox client ID
      const clientSecret = "ELZfZJzG29tgQBnF5bRY5u__o9Tq54KLzO1lGQcoPnAKsgsHpsCgdMcke2P5f7Z3m2QDggVgE2seU0X6"; // Replace with your actual sandbox client secret

      const credentials = btoa(`${clientID}:${clientSecret}`); // Base64 encode the client ID and secret

      const response = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "grant_type=client_credentials"
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Access Token:", data.access_token);
        return data.access_token;
      } else {
        console.error('Error fetching access token:', data);
        throw new Error("Unable to fetch PayPal access token");
      }
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/BagView.vue" line="431">

---

The <SwmToken path="/frontend/src/views/BagView.vue" pos="436:1:1" line-data="    deleteProductFromCart(product) {">`deleteProductFromCart`</SwmToken> method removes a product from the cart.

@param {Object} <SwmToken path="/frontend/src/views/BagView.vue" pos="436:3:3" line-data="    deleteProductFromCart(product) {">`product`</SwmToken> - The product to be removed from the cart.

```
    /**
     * Deletes a product from the cart.
     *
     * @param {Object} product - The product to be removed from the cart.
     */
    deleteProductFromCart(product) {
      this.$store.dispatch("removeFromCartAndHandleReceipt", product);
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/BagView.vue" line="440">

---

The <SwmToken path="/frontend/src/views/BagView.vue" pos="446:1:1" line-data="    increaseQuantity(index, product) {">`increaseQuantity`</SwmToken> and <SwmToken path="/frontend/src/views/BagView.vue" pos="53:8:8" line-data="                    &lt;button @click=&quot;decreaseQuantity(index, product)&quot;&gt;-&lt;/button&gt;">`decreaseQuantity`</SwmToken> methods adjust the quantity of a product in the cart.

@param {number} <SwmToken path="/frontend/src/views/BagView.vue" pos="446:3:3" line-data="    increaseQuantity(index, product) {">`index`</SwmToken> - The index of the product in the cart.\
@param {Object} <SwmToken path="/frontend/src/views/BagView.vue" pos="446:6:6" line-data="    increaseQuantity(index, product) {">`product`</SwmToken> - The product whose quantity is to be increased.

```
    /**
     * Increases the quantity of a product in the cart.
     *
     * @param {number} index - The index of the product in the cart.
     * @param {Object} product - The product whose quantity is to be increased.
     */
    increaseQuantity(index, product) {
      this.cartProducts[index].quantity++;
      this.$store.commit("updateQuantity", { _id: product.product._id, quantity: this.cartProducts[index].quantity });
      this.$store.dispatch("handleReceipt", { payload: product.product, number: -1 });
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/BagView.vue" line="452">

---

This code snippet decreases the quantity of a product in the cart, ensuring it doesn't go below 1.

@param {number} <SwmToken path="/frontend/src/views/BagView.vue" pos="458:3:3" line-data="    decreaseQuantity(index, product) {">`index`</SwmToken> - The index of the product in the cart.\
@param {Object} <SwmToken path="/frontend/src/views/BagView.vue" pos="458:6:6" line-data="    decreaseQuantity(index, product) {">`product`</SwmToken> - The product whose quantity is to be decreased. \*/

```
    /**
     * Decreases the quantity of a product in the cart, ensuring it doesn't go below 1.
     *
     * @param {number} index - The index of the product in the cart.
     * @param {Object} product - The product whose quantity is to be decreased.
     */
    decreaseQuantity(index, product) {
      if (this.cartProducts[index].quantity > 1) {
        this.cartProducts[index].quantity--;
        this.$store.commit("updateQuantity", { _id: product.product._id, quantity: this.cartProducts[index].quantity });
        this.$store.dispatch("handleReceipt", { payload: product.product, number: 1 });
      }
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/BagView.vue" line="466">

---

The <SwmToken path="/frontend/src/views/BagView.vue" pos="469:1:1" line-data="    openClientOverlay() {">`openClientOverlay`</SwmToken>, <SwmToken path="/frontend/src/views/BagView.vue" pos="20:5:5" line-data="        @close=&quot;closeClientOverlay&quot;">`closeClientOverlay`</SwmToken>, and <SwmToken path="/frontend/src/views/BagView.vue" pos="21:7:7" line-data="        @close-data=&quot;closeClientOverlayWithData&quot;">`closeClientOverlayWithData`</SwmToken> methods manage the client search overlay.

```
    /**
     * Opens the client search overlay to allow user to select or modify client details.
     */
    openClientOverlay() {
      this.showClientSearch = true;
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/BagView.vue" line="473">

---

This code snippet closes the client search overlay by setting the <SwmToken path="/frontend/src/views/BagView.vue" pos="477:3:3" line-data="      this.showClientSearch = false;">`showClientSearch`</SwmToken> property to `false`.

```
    /**
     * Closes the client search overlay without saving changes.
     */
    closeClientOverlay() {
      this.showClientSearch = false;
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/BagView.vue" line="480">

---

This code snippet closes the client search overlay and updates the client data with the selected/modified client.

@param {Object} <SwmToken path="/frontend/src/views/BagView.vue" pos="485:3:3" line-data="    closeClientOverlayWithData(client) {">`client`</SwmToken> - The updated client data.

```
    /**
     * Closes the client search overlay and updates the client data with the selected/modified client.
     *
     * @param {Object} client - The updated client data.
     */
    closeClientOverlayWithData(client) {
      this.showClientSearch = false;
      this.client = client;
      this.clientName = client.name;
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/BagView.vue" line="491">

---

The <SwmToken path="/frontend/src/views/BagView.vue" pos="495:1:1" line-data="    setupPayPalButton() {">`setupPayPalButton`</SwmToken> method configures the <SwmToken path="/frontend/src/views/BagView.vue" pos="492:9:9" line-data="     * Sets up the PayPal button using the PayPal SDK.">`PayPal`</SwmToken> button and handles the payment process.

```
    /**
     * Sets up the PayPal button using the PayPal SDK.
     * Configures the payment process and handles approval and errors.
     */
    setupPayPalButton() {
      loadScript({
        "client-id": "AZARWGYIQ1t8j1JqA2s-3G4ttRXc-uivXrk31VcVFnuQHMADwtmhEHRaHe7F_WAgZbp5UZO7mnnvPHyM", // Replace with your actual sandbox client ID
        currency: "CAD"
      }).then(paypal => {
        paypal.Buttons({
          /**
           * Creates the order with the total amount.
           *
           * @param {Object} data - Data related to the transaction.
           * @param {Object} actions - PayPal actions for creating the order.
           * @returns {Promise<string>} - The PayPal order ID.
           */
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: this.total,
                }
              }]
            });
          },

          /**
           * Handles the approval of the transaction.
           *
           * @param {Object} data - Data related to the transaction.
           * @param {Object} actions - PayPal actions for capturing the order.
           * @returns {Promise<void>}
           */
          onApprove: (data, actions) => {
            console.log("Transaction Data:", data);
            return actions.order.capture().then(details => {
              this.paymentID = data.paymentID;
              this.paymentStatus = "Completed"; // Update payment status
              console.log(`Transaction completed by ${details.payer.name.given_name}`);
              this.transferInvoice(); // Proceed to transfer invoice after payment
            });
          },

          /**
           * Handles errors during the transaction process.
           *
           * @param {Object} err - The error encountered during the transaction.
           */
          onError: (err) => {
            console.error('Error during PayPal transaction:', err);
            this.paymentStatus = "Failed"; // Mark payment as failed
          }
        }).render("#paypal-button-container"); // Render PayPal button into the container
      }).catch(err => {
        console.error('Error loading PayPal SDK:', err);
      });
    }
  },
```

---

</SwmSnippet>

# Lifecycle hooks

<SwmSnippet path="/frontend/src/views/BagView.vue" line="551">

---

The <SwmToken path="/frontend/src/views/BagView.vue" pos="552:17:17" line-data="   * Lifecycle hook called when the component is mounted.">`mounted`</SwmToken> lifecycle hook loads the cart products and sets up the <SwmToken path="/frontend/src/views/BagView.vue" pos="553:17:17" line-data="   * Loads cart products and sets up the PayPal button.">`PayPal`</SwmToken> button when the component is mounted.

```
  /**
   * Lifecycle hook called when the component is mounted.
   * Loads cart products and sets up the PayPal button.
   */
  mounted() {
    this.loadCartProducts();
    this.setupPayPalButton(); // Configure PayPal button when component is mounted
  }
```

---

</SwmSnippet>

This concludes the walkthrough of the <SwmToken path="/frontend/src/views/BagView.vue" pos="2:7:7" line-data=" * RetailHub - BagView.vue">`BagView`</SwmToken> feature implementation. The code snippets and explanations provided should give you a clear understanding of how the feature was designed and implemented.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBUmV0YWlsSFVCLUZyb250ZW5kJTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="RetailHUB-Frontend"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
