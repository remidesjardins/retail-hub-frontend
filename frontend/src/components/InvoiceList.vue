<!--
  =====================================================
  Project: RetailHub
  File: InvoiceList.vue
  Description: Component for displaying and managing recent sales invoices within RetailHub.
  Participants:
    - Alexandre Borny
    - Maël Castellan
    - Laura Donato
    - Rémi Desjardins
  =====================================================
-->

<template>
  <!-- Container for the invoice list section -->
  <div class="invoice-list">
    <h2>
      Recent Sales <i class="fa fa-history"></i>
    </h2>

    <!-- Container for individual invoice cards -->
    <div class="invoice-container">
      <!-- Loop through sales to display each invoice -->
      <div
          v-for="(sale, index) in (sales.length ? sales.slice().reverse() : Array(1).fill({}))"
          :key="sale._id || index"
          class="invoice-card"
      >
        <!-- Display sale details if sales data is available -->
        <template v-if="sales.length">
          <p class="customer-name">{{ sale.customer.name }}</p>
          <p class="total-price">{{ sale.total_price }} €</p>
          <p class="sale-reference">{{ sale.reference }}</p>

          <!-- Action buttons for each invoice -->
          <div class="card-actions">
            <!-- Button to update the sale -->
            <button @click="updateSale(sale)" class="action-btn update-btn">
              <i class="fa fa-pencil-alt"></i>
            </button>
            <!-- Button to delete the sale -->
            <button @click="deleteSale(sale._id)" class="action-btn delete-btn">
              <i class="fa fa-trash"></i>
            </button>
            <!-- Button to generate an invoice -->
            <button @click="generateInvoice(sale)" class="action-btn invoice-btn">
              <i class="fa fa-file-invoice"></i>
            </button>
          </div>
        </template>

        <!-- Display a message if no sales are found -->
        <template v-else>
          <p class="nothing-found">Oups, nothing found</p>
        </template>
      </div>
    </div>
  </div>

  <!-- UpdateSaleForm component displayed conditionally -->
  <UpdateSaleForm
      v-if="selectedSale"
      :sale="selectedSale"
      :show="showUpdateOverlay"
      @closeOverlay="closeUpdateOverlay"
  />
</template>

<script>
/**
 * InvoiceList Component
 * Displays a list of recent sales and provides functionalities to update, delete, and generate invoices for each sale.
 */
import UpdateSaleForm from "@/components/UpdateSaleForm.vue";

export default {
  props: {
    /**
     * Array of sales data passed from the parent component.
     * @type {Array}
     */
    sales: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      /**
       * Controls the visibility of the UpdateSaleForm component.
       * @type {Boolean}
       */
      showUpdateOverlay: false,

      /**
       * The currently selected sale for updating.
       * @type {Object|null}
       */
      selectedSale: null,

      /**
       * Local copy of sales data for frontend manipulation.
       * @type {Array}
       */
      localSales: this.sales,
    };
  },
  components: {
    UpdateSaleForm,
  },
  methods: {
    /**
     * Handles actions related to the customer's name.
     * Currently logs the customer information to the console.
     * @param {Object} customer - The customer object.
     */
    handleCustomerName(customer) {
      console.log("CUSTOMER :", customer);
    },

    /**
     * Opens the UpdateSaleForm by setting the selectedSale and showing the overlay.
     * @param {Object} sale - The sale object to be updated.
     */
    updateSale(sale) {
      this.selectedSale = sale;
      this.showUpdateOverlay = true;
    },

    /**
     * Closes the UpdateSaleForm overlay by hiding it.
     */
    closeUpdateOverlay() {
      this.showUpdateOverlay = false;
    },

    /**
     * Deletes a sale by its ID after user confirmation.
     * Sends a DELETE request to the API and updates the local sales list upon success.
     * @param {String} saleId - The ID of the sale to be deleted.
     */
    async deleteSale(saleId) {
      if (confirm("Are you sure you want to delete this sale?")) {
        try {
          const response = await fetch(`https://com.servhub.fr/api/sales/${saleId}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            alert('Sale deleted successfully!');
            // Remove the deleted sale from the local sales list
            this.localSales = this.localSales.filter(sale => sale._id !== saleId);
          } else {
            const errorData = await response.json();
            alert(`Error deleting sale: ${errorData.message}`);
          }
        } catch (error) {
          console.error('Error deleting sale:', error);
        }
      }
    },

    /**
     * Retrieves an access token from PayPal for API authentication.
     * @returns {Promise<String>} The access token.
     * @throws Will throw an error if the token cannot be fetched.
     */
    async getAccessToken() {
      const clientID = "AZARWGYIQ1t8j1JqA2s-3G4ttRXc-uivXrk31VcVFnuQHMADwtmhEHRaHe7F_WAgZbp5UZO7mnnvPHyM";
      const clientSecret = "ELZfZJzG29tgQBnF5bRY5u__o9Tq54KLzO1lGQcoPnAKsgsHpsCgdMcke2P5f7Z3m2QDggVgE2seU0X6";

      const credentials = btoa(`${clientID}:${clientSecret}`);
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
        return data.access_token;
      } else {
        throw new Error("Unable to fetch PayPal access token");
      }
    },

    /**
     * Generates and sends an invoice for a given sale using PayPal's API.
     * @param {Object} sale - The sale object for which the invoice is to be generated.
     */
    async generateInvoice(sale) {
      try {
        // Validate that the sale has products and customer information
        if (!sale.sale.products || !sale.customer) {
          console.error("Sale does not have products or customer information.", sale);
          return;
        }

        // Obtain PayPal access token
        const accessToken = await this.getAccessToken();

        // Split customer address into individual components
        const addressParts = sale.customer.address.split(",");
        const addressLine1 = addressParts[0]?.trim() || "";
        const city = addressParts[1]?.trim() || "";
        const state = addressParts[2]?.trim() || "";
        const postalCode = addressParts[3]?.trim() || "";
        const country = addressParts[4]?.trim() || "CA"; // Default country is Canada (CA)

        if (!sale.customer || !sale.customer.address) {
          console.error("Customer address is missing.", sale);
          return;
        }

        // Fetch complete product details for each product in the sale
        const items = await Promise.all(sale.sale.products.map(async (product) => {
          console.log(product.SKU);
          const productDetails = await this.fetchProduct(product.SKU); // Fetch product details by SKU
          console.log(productDetails);
          return {
            name: productDetails.name || "Unnamed product", // Use the fetched product name
            description: productDetails.Details || "Product description",
            quantity: product.quantity || 1, // Use the sale quantity
            unit_amount: {
              currency_code: "CAD",
              value: product.price_per_unit || 0 // Use the fetched product price
            },
            tax: {
              name: "Sales Tax",
              amount: {
                currency_code: "CAD",
                value: ((product.price_per_unit * product.quantity) * 0.0725).toFixed(2) // Tax calculation
              },
              percent: "7.25" // Tax percentage
            }
          };
        }));

        // Calculate total tax and item amounts
        const tax_total = items.reduce((sum, product) => sum + parseFloat(product.tax.amount.value), 0).toFixed(2);
        const item_total = items.reduce((sum, product) => sum + (product.unit_amount.value * product.quantity), 0).toFixed(2);

        // Create the invoice payload for PayPal API
        const invoicePayload = {
          detail: {
            currency_code: "CAD",
            invoice_number: `INV-${new Date().getTime()}`,
            reference: sale.reference || `REF-${new Date().getTime()}`,
            invoice_date: new Date().toISOString().split("T")[0],
            note: "Thank you for your purchase.",
            payment_term: {
              term_type: "NO_DUE_DATE",
            },
            payment_detail: {
              type: "PAYPAL",
              transaction_id: sale.id || "sampleTransactionID",
              method: "PayPal"
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
                  given_name: sale.customer.firstName,
                  surname: sale.customer.lastName
                },
                address: {
                  address_line_1: addressLine1,
                  admin_area_2: city,
                  admin_area_1: state,
                  postal_code: postalCode,
                  country_code: "CA"
                },
                email_address: sale.customer.email
              }
            }
          ],
          items,
          amount: {
            breakdown: {
              item_total: {
                currency_code: "CAD",
                value: item_total // Item total calculation
              },
              tax_total: {
                currency_code: "CAD",
                value: tax_total // Tax total calculation
              }
            },
            total: {
              currency_code: "CAD",
              value: sale.total_price || (parseFloat(item_total) + parseFloat(tax_total)).toFixed(2)
            },
            paid_amount: {
              currency_code: "CAD",
              value: sale.total_price || (parseFloat(item_total) + parseFloat(tax_total)).toFixed(2) // Mark total as paid
            }
          }
        };

        // Send the invoice creation request to PayPal
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
          // Fetch the invoice details using the provided href
          const invoiceDetailsResponse = await fetch(invoiceResult.href, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          });

          const invoiceDetails = await invoiceDetailsResponse.json();
          console.log("Invoice details:", invoiceDetails);

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

          // Open the invoice in a new browser tab if a recipient view URL is provided
          const recipientViewURL = invoiceDetails.detail.metadata.recipient_view_url;
          if (recipientViewURL) {
            window.open(recipientViewURL); // Open the invoice in a new tab
          }
        }
      } catch (error) {
        console.error("Error generating invoice:", error);
      }
    },

    /**
     * Fetches product details from the API based on the provided SKU.
     * @param {String} SKU - The Stock Keeping Unit identifier for the product.
     * @returns {Promise<Object>} The product details.
     * @throws Will throw an error if the product cannot be fetched.
     */
    async fetchProduct(SKU) {
      try {
        const response = await fetch(`https://com.servhub.fr/api/products/${SKU}`);
        if (!response.ok) {
          throw new Error(`Product with SKU: ${SKU} not found.`);
        }
        console.log(response.body);
        return await response.json(); // Return the product details
      } catch (error) {
        console.error(`Error fetching product with SKU: ${SKU}`, error);
        throw error;
      }
    },
  },
};
</script>

<style scoped>

h2 {
  padding-bottom: 1rem !important;
}

.invoice-list {
  padding: 1rem;
  margin: 0 1rem 1rem 1rem;
}

.invoice-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: flex-start;
}

.invoice-card {
  min-width: 13rem;
  max-width: 13rem;
  height: 13rem;
  padding: .625rem;
  border-radius: 1.25rem;
  background: #d0e7eb;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative; /* Make the card relative to position the buttons */
}

.customer-name {
  font-weight: bold;
  font-size: 1.75rem;
  margin-bottom: .625rem;
  margin-left: .5rem;
}

.total-price {
  font-size: 1.5rem;
  margin-left: .625rem;
}

.sale-reference {
  font-size: 1.125rem;
  color: grey;
  margin-top: .625rem;
  margin-bottom: .625rem;
  margin-left: .625rem;
}

/* Action buttons (Update and Delete) */
.card-actions {
  position: absolute;
  bottom: .625rem;
  right: .625rem;
  display: flex;
  gap: .625rem;
}

.action-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: .313rem;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.update-btn {
  color: black; /* Green color for update */
}

.delete-btn {
  color: #f44336; /* Red color for delete */
}

.action-btn:hover {
  background-color: rgba(0, 0, 0, 0.1); /* Hover effect */
}

.nothing-found {
  font-size: 1.125rem;
  color: red;
  text-align: center;
  margin-top: 2.5rem;
  font-weight: bold;
}

.invoice-btn {
  color: #3b5998; /* Blue color for generating invoice */
}

</style>