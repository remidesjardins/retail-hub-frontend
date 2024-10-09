---
title: CreateClient
---
# Introduction

This document will walk you through the implementation of the <SwmToken path="/frontend/src/components/CreateClient.vue" pos="98:5:5" line-data="            @click=&quot;createClient&quot;">`createClient`</SwmToken> feature in the <SwmToken path="/frontend/src/components/CreateClient.vue" pos="3:4:4" line-data="  Project: RetailHub">`RetailHub`</SwmToken> project.

The feature allows users to create a new client by filling out a form and submitting it. The form data is then sent to an API endpoint to create the client in the backend.

We will cover:

1. The structure of the <SwmToken path="/frontend/src/components/CreateClient.vue" pos="98:5:5" line-data="            @click=&quot;createClient&quot;">`createClient`</SwmToken> component.
2. The data model used for the client information.
3. The methods for handling form submission and API interaction.

# Component structure

The <SwmToken path="/frontend/src/components/CreateClient.vue" pos="98:5:5" line-data="            @click=&quot;createClient&quot;">`createClient`</SwmToken> component is defined in <SwmPath>[frontend/src/components/CreateClient.vue](/frontend/src/components/CreateClient.vue)</SwmPath>. It includes an overlay container, a form for client details, and a submit button.

<SwmSnippet path="/frontend/src/components/CreateClient.vue" line="14">

---

The overlay container and form structure:

```
<template>
  <!-- Overlay container to focus on the Create Client form -->
  <div class="overlay-create-client">
    <div class="overlay-content">
      <!-- Close button to exit the Create Client overlay -->
      <button class="close-button" @click="closeOverlay">✖</button>

      <!-- Header for the Create Client form -->
      <h1>Create Client</h1>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/CreateClient.vue" line="23">

---

The form includes fields for last name, first name, phone number, email, and address:

```

      <!-- Form for creating a new client -->
      <form @submit.prevent="submitForm">
        <!-- Group for Last Name and First Name inputs -->
        <div class="form-group">
          <input
              type="text"
              placeholder="Last Name"
              v-model="client.lastName"
              required
          />
          <input
              type="text"
              placeholder="First Name"
              v-model="client.firstName"
              required
          />
        </div>

        <!-- Group for Phone Number and E-Mail inputs -->
        <div class="form-group">
          <input
              type="text"
              placeholder="Phone Number"
              v-model="client.phoneNumber"
              required
          />
          <input
              type="email"
              placeholder="Email"
              v-model="client.email"
              class="full-width"
              required
          />
        </div>

        <!-- Group for Address inputs -->
        <div class="form-group form-group-address">
          <input
              type="text"
              placeholder="Street"
              v-model="client.addressLine1"
              required
          />
          <input
              type="text"
              placeholder="City"
              v-model="client.city"
              required
          />
          <input
              type="text"
              placeholder="State"
              v-model="client.state"
              required
          />
          <input
              type="text"
              placeholder="Postal Code"
              v-model="client.postalCode"
              required
          />
          <input
              type="text"
              placeholder="Country"
              v-model="client.country"
              class="full-width"
              required
          />
        </div>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/CreateClient.vue" line="93">

---

The form submission is handled by a button that triggers the <SwmToken path="/frontend/src/components/CreateClient.vue" pos="98:5:5" line-data="            @click=&quot;createClient&quot;">`createClient`</SwmToken> method:

```

        <!-- Submit button to create the client -->
        <button
            type="submit"
            class="create-client-button"
            @click="createClient"
        >
          Create client
        </button>
      </form>
    </div>
  </div>
</template>
```

---

</SwmSnippet>

# Data model

<SwmSnippet path="/frontend/src/components/CreateClient.vue" line="113">

---

The component uses a <SwmToken path="/frontend/src/components/CreateClient.vue" pos="116:9:9" line-data="       * Object holding the client&#39;s information entered in the form.">`client`</SwmToken> object to store the information entered in the form. This object is defined in the <SwmToken path="/frontend/src/components/CreateClient.vue" pos="113:1:1" line-data="  data() {">`data`</SwmToken> function:

```
  data() {
    return {
      /**
       * Object holding the client's information entered in the form.
       */
      client: {
        lastName: '',
        firstName: '',
        phoneNumber: '',
        email: '',
        addressLine1: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
      }
    };
  },
```

---

</SwmSnippet>

# Methods

## Closing the overlay

<SwmSnippet path="/frontend/src/components/CreateClient.vue" line="132">

---

The <SwmToken path="/frontend/src/components/CreateClient.vue" pos="135:1:1" line-data="    closeOverlay() {">`closeOverlay`</SwmToken> method emits a 'close' event to the parent component to close the overlay:

```
    /**
     * Closes the Create Client overlay by emitting a 'close' event to the parent component.
     */
    closeOverlay() {
      this.$emit('close');
    },
```

---

</SwmSnippet>

## Submitting the form

<SwmSnippet path="/frontend/src/components/CreateClient.vue" line="139">

---

The <SwmToken path="/frontend/src/components/CreateClient.vue" pos="142:1:1" line-data="    submitForm() {">`submitForm`</SwmToken> method handles the form submission by logging the client data and calling the <SwmToken path="/frontend/src/components/CreateClient.vue" pos="146:3:3" line-data="      this.createClient();">`createClient`</SwmToken> method:

```
    /**
     * Handles the form submission by logging the client data and initiating the client creation process.
     */
    submitForm() {
      // Log the client data for debugging purposes
      console.log(this.client);
      // Call the method to create the client
      this.createClient();
    },
```

---

</SwmSnippet>

## Creating the client

<SwmSnippet path="/frontend/src/components/CreateClient.vue" line="149">

---

The <SwmToken path="/frontend/src/components/CreateClient.vue" pos="153:1:1" line-data="    createClient() {">`createClient`</SwmToken> method sends a POST request to the API to create a new client. It prepares the request headers and body, sends the request, and handles the response:

```
    /**
     * Sends a POST request to the API to create a new client with the entered information.
     * Upon successful creation, it closes the overlay and logs the result.
     */
    createClient() {
      // Set up the request headers
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      // Combine first name and last name into a single 'name' field
      const name = `${this.client.firstName} ${this.client.lastName}`;

      // Combine address fields into a single 'address' string
      const fullAddress = `${this.client.addressLine1}, ${this.client.city}, ${this.client.state}, ${this.client.postalCode}, ${this.client.country}`;

      // Prepare the request body with the client information
      const row = JSON.stringify({
        name: name,
        email: this.client.email,
        phone: this.client.phoneNumber,
        address: fullAddress // Combine all address fields into one string
      });

      // Define the request options for the fetch API
      const requestOptions = {
        headers: myHeaders,
        method: "POST",
        body: row,
        redirect: "follow"
      };

      // Send the POST request to create the new client
      fetch("https://com.servhub.fr/api/customers/", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            // Log the result for debugging purposes
            console.log(result);
            // Optionally, you can emit an event or perform additional actions here
          })
          .catch((error) => console.error("Error creating client:", error));
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/CreateClient.vue" line="189">

---

Finally, the <SwmToken path="/frontend/src/components/CreateClient.vue" pos="98:5:5" line-data="            @click=&quot;createClient&quot;">`createClient`</SwmToken> method emits a 'close' event to close the overlay after attempting to create the client:

```

      // Emit the 'close' event to close the overlay after attempting to create the client
      this.$emit('close');
    },
```

---

</SwmSnippet>

This concludes the walkthrough of the <SwmToken path="/frontend/src/components/CreateClient.vue" pos="98:5:5" line-data="            @click=&quot;createClient&quot;">`createClient`</SwmToken> feature. The component structure, data model, and methods work together to allow users to create a new client by filling out a form and submitting it.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBUmV0YWlsSFVCLUZyb250ZW5kJTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="RetailHUB-Frontend"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
