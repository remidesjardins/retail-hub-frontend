---
title: UpdateClient
---
# Introduction

This document will walk you through the implementation of the <SwmToken path="/frontend/src/components/UpdateClient.vue" pos="22:10:10" line-data="      &lt;form @submit.prevent=&quot;updateClient&quot;&gt;">`updateClient`</SwmToken> feature in the <SwmToken path="/frontend/src/components/UpdateClient.vue" pos="2:3:3" line-data=" * RetailHub - UpdateCliant.vue">`RetailHub`</SwmToken> application.

The feature allows users to modify an existing client's information through a form. The component is located at <SwmPath>[frontend/src/components/UpdateClient.vue](/frontend/src/components/UpdateClient.vue)</SwmPath>.

We will cover:

1. The structure of the <SwmToken path="/frontend/src/components/UpdateClient.vue" pos="22:10:10" line-data="      &lt;form @submit.prevent=&quot;updateClient&quot;&gt;">`updateClient`</SwmToken> component.
2. The form elements and their bindings.
3. The methods for handling form submission and overlay actions.

# Component structure

<SwmSnippet path="/frontend/src/components/UpdateClient.vue" line="1">

---

The <SwmToken path="/frontend/src/components/UpdateClient.vue" pos="22:10:10" line-data="      &lt;form @submit.prevent=&quot;updateClient&quot;&gt;">`updateClient`</SwmToken> component is designed to provide a form for modifying client information. It includes a template for the form, props for passing client data, and methods for handling form submission and overlay actions.

```
<!--
 * RetailHub - UpdateCliant.vue
 *
 * Participants:
 * - Alexandre Borny
 * - Maël Castellan
 * - Laura Donato
 * - Rémi Desjardins
 *
 * This component provides a form to modify an existing client's information in RetailHub.
 -->
```

---

</SwmSnippet>

# Template structure

<SwmSnippet path="/frontend/src/components/UpdateClient.vue" line="13">

---

The template defines the overlay and form structure. It includes a close button, a form with various input fields, and a submit button.

```
<template>
  <div class="overlay">
    <div class="overlay-content">
      <!-- Close button to hide the overlay -->
      <button class="close-button" @click="closeOverlay">✖</button>

      <h1>Modify Client</h1>
```

---

</SwmSnippet>

# Form elements

<SwmSnippet path="/frontend/src/components/UpdateClient.vue" line="20">

---

The form contains input fields for the client's last name, phone number, email, and address. Each input field is bound to a property of the <SwmToken path="/frontend/src/components/UpdateClient.vue" pos="21:9:9" line-data="      &lt;!-- Form to update client information --&gt;">`client`</SwmToken> object using <SwmToken path="/frontend/src/components/UpdateClient.vue" pos="25:16:18" line-data="          &lt;input type=&quot;text&quot; id=&quot;name&quot; v-model=&quot;client.name&quot; required/&gt;">`v-model`</SwmToken>.

```

      <!-- Form to update client information -->
      <form @submit.prevent="updateClient">
        <div class="form-group">
          <label for="name">Last Name</label>
          <input type="text" id="name" v-model="client.name" required/>
        </div>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/UpdateClient.vue" line="27">

---

The form includes fields for the client's phone number and email.

```

        <div class="form-group form-inline">
          <div>
            <label for="phone">Phone Number</label>
            <input type="text" id="phone" v-model="client.phone" required />
          </div>
          <div>
            <label for="email">Email</label>
            <input type="email" id="email" v-model="client.email" required />
          </div>
        </div>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/UpdateClient.vue" line="38">

---

The address fields are grouped together for better organization.

```

        <div class="form-group form-group-address">
          <input type="text" placeholder="Street" v-model="client.addressLine1" required />
          <input type="text" placeholder="City" v-model="client.city" required />
          <input type="text" placeholder="State" v-model="client.state" required />
          <input type="text" placeholder="Postal Code" v-model="client.postalCode" required />
          <input type="text" placeholder="Country" v-model="client.country" class="full-width" required />
        </div>
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/UpdateClient.vue" line="46">

---

The form submission is handled by the <SwmToken path="/frontend/src/components/UpdateClient.vue" pos="22:10:10" line-data="      &lt;form @submit.prevent=&quot;updateClient&quot;&gt;">`updateClient`</SwmToken> method, which is triggered when the form is submitted.

```

        <button type="submit" class="update-client-button">Modify Client</button>
      </form>
    </div>
  </div>
</template>
```

---

</SwmSnippet>

# Props

<SwmSnippet path="/frontend/src/components/UpdateClient.vue" line="55">

---

The component receives a <SwmToken path="/frontend/src/components/UpdateClient.vue" pos="57:5:5" line-data="     * The client object containing current client information.">`client`</SwmToken> object as a prop. This object contains the current client information and is required for the component to function correctly.

```
  props: {
    /**
     * The client object containing current client information.
     * This prop is required for the component to function correctly.
     */
    client: {
      type: Object,
      required: true,
    },
  },
```

---

</SwmSnippet>

# Methods

## <SwmToken path="/frontend/src/components/UpdateClient.vue" pos="17:16:16" line-data="      &lt;button class=&quot;close-button&quot; @click=&quot;closeOverlay&quot;&gt;✖&lt;/button&gt;">`closeOverlay`</SwmToken>

<SwmSnippet path="/frontend/src/components/UpdateClient.vue" line="67">

---

The <SwmToken path="/frontend/src/components/UpdateClient.vue" pos="71:1:1" line-data="    closeOverlay() {">`closeOverlay`</SwmToken> method closes the overlay without saving any changes. It emits a 'close' event to notify the parent component.

```
    /**
     * Closes the overlay without saving any changes.
     * Emits a 'close' event to notify the parent component.
     */
    closeOverlay() {
      this.$emit('close');
    },
```

---

</SwmSnippet>

## <SwmToken path="/frontend/src/components/UpdateClient.vue" pos="22:10:10" line-data="      &lt;form @submit.prevent=&quot;updateClient&quot;&gt;">`updateClient`</SwmToken>

<SwmSnippet path="/frontend/src/components/UpdateClient.vue" line="75">

---

The <SwmToken path="/frontend/src/components/UpdateClient.vue" pos="79:1:1" line-data="    updateClient() {">`updateClient`</SwmToken> method sends an update request to the server with the modified client information. It handles the response and potential errors.

```
    /**
     * Sends an update request to the server with the modified client information.
     * Handles the response and potential errors.
     */
    updateClient() {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/UpdateClient.vue" line="82">

---

The client data is serialized into JSON format.

```

      const updatedClientData = JSON.stringify({
        name: this.client.name,
        email: this.client.email,
        phone: this.client.phone,
        address: {
          addressLine1: this.client.addressLine1,
          city: this.client.city,
          state: this.client.state,
          postalCode: this.client.postalCode,
          country: this.client.country,
        },
      });
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/UpdateClient.vue" line="95">

---

Request options are configured for the fetch call.

```

      const requestOptions = {
        headers: myHeaders,
        method: "PUT",
        body: updatedClientData,
        redirect: "follow"
      };
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/UpdateClient.vue" line="102">

---

The fetch call sends the update request to the server. If the request is successful, the overlay is closed with the updated data. If an error occurs, an alert is shown.

```

      fetch(`https://com.servhub.fr/api/customers/${this.client._id}`, requestOptions)
          .then((response) => {
            if (!response.ok) {
              return response.json().then((error) => {
                throw new Error(error.message);
              });
            }
            return response.json();
          })
          .then((result) => {
            this.closeOverlayWithData();
          })
          .catch((error) => {
            alert(`Error updating client: ${error.message}`);
          });
    },
```

---

</SwmSnippet>

## <SwmToken path="/frontend/src/components/UpdateClient.vue" pos="113:3:3" line-data="            this.closeOverlayWithData();">`closeOverlayWithData`</SwmToken>

<SwmSnippet path="/frontend/src/components/UpdateClient.vue" line="120">

---

The <SwmToken path="/frontend/src/components/UpdateClient.vue" pos="123:1:1" line-data="    closeOverlayWithData() {">`closeOverlayWithData`</SwmToken> method closes the overlay and emits the updated client data to the parent component.

```
    /**
     * Closes the overlay and emits the updated client data to the parent component.
     */
    closeOverlayWithData() {
      this.$emit('close-data', this.client);
    },
```

---

</SwmSnippet>

This concludes the walkthrough of the <SwmToken path="/frontend/src/components/UpdateClient.vue" pos="22:10:10" line-data="      &lt;form @submit.prevent=&quot;updateClient&quot;&gt;">`updateClient`</SwmToken> feature. The component allows users to modify client information and handles form submission and overlay actions efficiently.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBUmV0YWlsSFVCLUZyb250ZW5kJTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="RetailHUB-Frontend"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
