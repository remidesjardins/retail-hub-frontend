
# RetailHub

RetailHub is a platform for managing sales, inventory, and clients. This README provides instructions on how to access the code, run the project, and a brief description of the key components and views.

## Table of Contents
1. [Accessing the Code](#accessing-the-code)
2. [Deployed Website](#deployed-website)
3. [Accessing the Documentation](#accessing-the-documentation)
4. [Running the Project](#running-the-project)
5. [Running Unit Tests](#running-unit-tests)
6. [Project Structure](#project-structure)

---

## Accessing the Code

RetailHub’s code is hosted in two separate repositories:
- **Back-end repository**: [GitHub - RetailHub Backend](https://github.com/Mael-Cas/RetailHub_backend)
- **Front-end repository**: [GitHub - RetailHub Frontend](https://github.com/remidesjardins/retail-hub-frontend.git)

Clone the respective repositories to access the project files.

---

## Deployed Website

The RetailHub platform is already deployed and accessible at:
- **Website**: [retailhub.fr](https://www.retailhub.fr)

---

## Accessing the Documentation

The project documentation is stored in the `docs` folder at the root of each GitHub repository. Each component has a dedicated markdown file that explains its code and functionalities.

This documentation is generated using **Swimm**, an AI-powered tool for creating and maintaining documentation. You can learn more about Swimm [here](https://swimm.io).

---

## Running the Project

To run the project locally, follow these steps:

1. **Navigate to the Front-end Directory**:
   ```bash
   cd frontend
   ```

2. **Install Dependencies**:
   Run the following command to install all necessary packages:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   To start the project in development mode, run:
   ```bash
   npm run dev
   ```

This will launch the project on `localhost`, and you can view it in your web browser.

---

## Running Unit Tests

To run unit tests, navigate to the `frontend` folder and use the following command:

```bash
npm run test:unit
```

This will execute the unit tests written for the project.

---

## Project Structure

Here’s a breakdown of the key components and views in the **frontend** of RetailHub:

### Components

- **AddProductForm.vue**: A form used by administrators to add new products to the inventory.

- **Category.vue**: Displays and manages product categories.

- **ChartComp.vue**: Renders various charts for analytics and reporting.

- **ClientSearchOverlay.vue**: A search overlay used to quickly find and select clients.

- **CommandBoxes.vue**: Contains action boxes for managing sales commands and options.

- **CreateClient.vue**: A form for creating new client profiles.

- **Header.vue**: The main header component, used for navigating the application.

- **InvoiceList.vue**: Displays a list of invoices with their details for easy management.

- **ModifyProductForm.vue**: A form used by administrators to modify existing products in the inventory.

- **NavBar.vue**: The navigation bar for accessing different sections of the platform.

- **PlaceProductForm.vue**: Used to place products in specific storage locations.

- **ProductDetails.vue**: Displays detailed information about a specific product.

- **ProductList.vue**: Displays a list of all available products in the system.

- **ReceiptParcelForm.vue**: Form used to confirm receipt of a parcel.

- **SearchBar.vue**: Allows users to search for products or clients using various criteria.

- **StockCorrection.vue**: A form used to correct stock levels manually.

- **UpdateClient.vue**: A form used to update a client's details.

- **UpdateSaleForm.vue**: A form for modifying details of an existing sale.

### Views

- **AdminView.vue**: The main view for administrators to manage products, clients, and sales.

- **BagView.vue**: Displays the user's cart and manages product quantities.

- **ClientSearchView.vue**: A view for searching and selecting clients from the database.

- **ClientView.vue**: Displays details and information related to a specific client.

- **EmployeeView.vue**: A view that allows employees to manage daily tasks like sales and stock.

- **InvoiceSearchView.vue**: A view dedicated to searching and managing invoices.

- **OverlayRestockAlert.vue**: Displays alerts for restocking products that are low in inventory.

- **SaleStockView.vue**: The main view for managing sales and stock data in the application.

---

For more details about each file, refer to the corresponding markdown file in the `docs` folder.

**This README is generated with ChatGPT**