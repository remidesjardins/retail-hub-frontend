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

<template>
  <div class="home-container">
    <!-- Client Search Overlay for selecting or modifying client details -->
    <ClientSearchOverlay
        v-if="showClientSearch"
        @close="closeClientOverlay"
        @close-data="closeClientOverlayWithData"
    />

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

                <div class="item-details">
                  <div class="details-left">
                    <!-- Product Name -->
                    <h3>{{ product.product.name }}</h3>
                    <!-- Product SKU -->
                    <p>{{ product.product.SKU }}</p>
                  </div>

                  <div class="details-right">
                    <!-- Quantity Selector -->
                    <div class="quantity-selector">
                      <button @click="decreaseQuantity(index, product)">-</button>
                      <span>{{ product.quantity }}</span>
                      <button @click="increaseQuantity(index, product)">+</button>
                    </div>
                    <span>
      <!-- Total Price for the Product -->
      $ {{ (product.product.price * product.quantity).toFixed(2) }}
    </span>
                    <!-- Trash Icon to Remove Product from Cart -->
                    <i class="fa-solid fa-trash" @click="deleteProductFromCart(product)"></i>
                  </div>
                </div>
              </div>
            </transition-group>
          </div>

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

<script>
import NavBar from "@/components/NavBar.vue";
import ClientSearchOverlay from "@/components/ClientSearchOverlay.vue";
import { loadScript } from "@paypal/paypal-js"; // PayPal SDK

export default {
  components: {
    NavBar,
    ClientSearchOverlay,
  },

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

    /**
     * Calculates the tax based on the subtotal and tax rate.
     *
     * @returns {string} - The tax amount formatted to two decimal places.
     */
    tax() {
      return (this.subtotal * this.taxRate).toFixed(2);
    },

    /**
     * Calculates the total amount including tax.
     *
     * @returns {string} - The total amount formatted to two decimal places.
     */
    total() {
      return (parseFloat(this.subtotal) + parseFloat(this.tax)).toFixed(2);
    }
  },

  methods: {
    /**
     * Loads the cart products from the Vuex store and reverses the order.
     */
    loadCartProducts() {
      this.cartProducts = this.$store.state.bagContents.reverse();
    },

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

    /**
     * Deletes a product from the cart.
     *
     * @param {Object} product - The product to be removed from the cart.
     */
    deleteProductFromCart(product) {
      this.$store.dispatch("removeFromCartAndHandleReceipt", product);
    },

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

    /**
     * Opens the client search overlay to allow user to select or modify client details.
     */
    openClientOverlay() {
      this.showClientSearch = true;
    },

    /**
     * Closes the client search overlay without saving changes.
     */
    closeClientOverlay() {
      this.showClientSearch = false;
    },

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

  /**
   * Lifecycle hook called when the component is mounted.
   * Loads cart products and sets up the PayPal button.
   */
  mounted() {
    this.loadCartProducts();
    this.setupPayPalButton(); // Configure PayPal button when component is mounted
  }
};
</script>

<style scoped>
/* Keyframes for dust effect animation */
@keyframes dust {
  0% {
    opacity: 1;
    transform: translateX(0) translateY(0) scale(1);
    filter: blur(0);
  }
  50% {
    opacity: 0.6;
    transform: translateX(-20px) translateY(-10px) scale(0.8);
    filter: blur(1px);
  }
  100% {
    opacity: 0;
    transform: translateX(50px) translateY(-50px) scale(0);
    filter: blur(3px);
  }
}

/* Animation applied when an item leaves the transition group */
.snap-leave-active {
  position: relative; /* Ensure the item is taken out of normal flow */
  animation: dust 1s forwards ease-out; /* 1-second dust animation */
}

/* Reset margins and paddings */
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

h2 {
  margin-bottom: 1rem;
}

/* Container for the home view */
.home-container {
  display: flex;
  height: 100vh; /* Ensure the container occupies the full viewport height */
  width: 100vw;  /* Full viewport width */
}

/* Content area styling */
.content {
  flex-grow: 1; /* Takes up remaining space next to the navbar */
  background-color: white; /* Explicit white background */
  padding: 1.25rem 0;
  display: flex;
  justify-content: flex-start; /* Align content to the top */
  align-items: flex-start;
  height: 100%; /* Occupies full available height */
}

/* Cart Page styling */
.cart-page {
  width: 100%;
  height: 100%; /* Ensures cart-page takes full available height */
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
}

/* Cart Container styling */
.cart-container {
  display: flex;
  justify-content: space-between;
  width: 100%; /* Occupies full available width */
  height: 100%; /* Occupies full available height */
  max-width: 75rem; /* Limits maximum width to keep it centered */
}

/* Shopping Bag styling */
.bag {
  width: 60%;
  height: 94%;
  background-color: #d0e7eb;
  padding: 1.25rem;
  border-radius: .938rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Distributes items vertically */
  overflow-x: auto; /* Allows horizontal scrolling */
  white-space: nowrap; /* Prevents line breaks for child elements */
  position: absolute;
  left: 4rem;
}

/* Individual Cart Item styling */
.cart-item {
  display: flex;
  min-width: 100%;
  justify-content: flex-end;
  align-items: center;
  padding: .938rem;
  border-radius: 1.563rem;
  background-color: transparent; /* No background */
}

/* Product Image styling */
.cart-item img {
  width: 6rem;
  height: auto;
  border-radius: .938rem; /* Slightly rounded corners for the image */
  margin-right: 1.25rem; /* Adds space between image and details */
}

/* Item Details container */
.item-details {
  flex-grow: 1;
  padding: .938rem;
  display: flex;
  justify-content: space-between;
  background-color: white; /* White background for details */
  border-radius: 1.563rem;
  margin-right: 1.25rem; /* Space between details and options */
  margin-left: 1.25rem; /* Ajouter de l'espace entre l'image et les détails */
  max-width: 80%;
  min-width: 80%;
  position: relative;
  right: 0.5rem;
}

.items span {
  font-weight: bold;
}

/* Left side of Item Details (Name and SKU) */
.details-left {
  display: flex;
  flex-direction: column;
  margin-right: auto; /* Pushes the right details to the right */
  max-width: 50%; /* Adjust as needed */
}

/* Right-aligned details (Quantity, Price, and Trash Icon) */
.details-right {
  display: flex;
  align-items: center;
  justify-content: flex-end; /* Aligns content to the right */
  gap: 1rem; /* Adds spacing between quantity, price, and trash icon */
}

/* Quantity Selector styling */
.quantity-selector {
  display: flex;
  align-items: center;
  margin: 0 1.25rem;
}

/* Quantity Selector buttons styling */
.quantity-selector button {
  background-color: #f0f0f0;
  border: none;
  padding: .313rem .625rem;
  font-size: 1rem;
  cursor: pointer;
}

.quantity-selector button:hover {
  background-color: gray;
}

/* Quantity display styling */
.quantity-selector span {
  margin: 0 .625rem;
  font-size: 1rem;
}

/* Product Name styling */
.item-details h3 {
  font-size: 1.25rem;
  margin: 0;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 20rem;
}

/* Product SKU styling */
.item-details p {
  font-size: .875rem;
  color: gray;
}

/* Product Total Price styling */
.item-details span {
  font-size: 1.125rem;
  font-weight: bold;
  color: black;
  text-align: right; /* Aligns price to the right */
}

/* Trash Icon styling (hidden by default) */
.item-details i.fa-trash {
  display: none; /* Hide the trash icon by default */
}

/* Show Trash Icon on hover */
.item-details:hover i.fa-trash {
  display: inline-block; /* Display trash icon when hovering over item details */
}

/* Trash Icon hover effect */
.fa-trash:hover {
  color: red;
}

/* General Button styling */
button {
  background-color: #274156;
  color: white;
  padding: .75rem;
  border: none;
  cursor: pointer;
  border-radius: 1.563rem;
  font-size: 1rem;
}

/* Button hover effect */
button:hover {
  background-color: #5d7180;
}

/* Summary Section styling */
.summary {
  width: 32%;
  height: 94%;
  padding: 1.25rem;
  background-color: #d0e7eb;
  border-radius: .938rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Ensures elements are well-spaced within the summary */
  position: absolute;
  right: .5rem;
}

</style>