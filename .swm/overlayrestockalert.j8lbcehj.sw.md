---
title: OverlayRestockAlert
---
# Introduction

This document will walk you through the implementation of the OverlayRestockAlert feature.

The feature displays and manages restock alerts within the <SwmToken path="/frontend/src/views/OverlayRestockAlert.vue" pos="3:4:4" line-data="  Project: RetailHub">`RetailHub`</SwmToken> application.

We will cover:

1. How the restock alerts are fetched and displayed.
2. How the restock alerts are deleted.
3. The lifecycle hook used to initiate fetching.

# Template structure

<SwmSnippet path="/frontend/src/views/OverlayRestockAlert.vue" line="14">

---

The template defines the structure of the restock alerts display. It includes a navigation bar and a container for the restock alerts.

```
<template>
  <div class="home-container">
    <NavBar class="navbar"></NavBar>

    <!-- Restock Alerts Container -->
    <div class="restocks-container">
      <h2>Restock Alerts</h2>
      <div class="alert-list">
        <div
            v-for="(alert, index) in restockAlerts.slice()"
            :key="index"
            class="alerts"
        >
          <div class="alert-content">
            <h3 class="alert-product">{{ alert.ref_product }}</h3> <!-- Reference on top -->
            <p class="alert-details">{{ alert.reason }}</p> <!-- Reason below reference, aligned left -->
          </div>
          <i class="fa-solid fa-check check-icon" @click="deleteAlert(alert._id)"></i> <!-- Check icon to the right -->
        </div>
      </div>
    </div>
  </div>
</template>
```

---

</SwmSnippet>

# Component registration

<SwmSnippet path="/frontend/src/views/OverlayRestockAlert.vue" line="46">

---

The <SwmToken path="/frontend/src/views/OverlayRestockAlert.vue" pos="47:1:1" line-data="    NavBar,">`NavBar`</SwmToken> component is registered for use within this component.

```
  components: {
    NavBar,
  },
```

---

</SwmSnippet>

# Data properties

<SwmSnippet path="/frontend/src/views/OverlayRestockAlert.vue" line="50">

---

The <SwmToken path="/frontend/src/views/OverlayRestockAlert.vue" pos="56:1:1" line-data="      restockAlerts: [],">`restockAlerts`</SwmToken> array holds all restock alerts fetched from the API.

```
  data() {
    return {
      /**
       * Array holding all restock alerts fetched from the API.
       * @type {Array}
       */
      restockAlerts: [],
    };
  },
```

---

</SwmSnippet>

# Fetching restock alerts

<SwmSnippet path="/frontend/src/views/OverlayRestockAlert.vue" line="61">

---

The <SwmToken path="/frontend/src/views/OverlayRestockAlert.vue" pos="65:3:3" line-data="    async fetchGetAlert() {">`fetchGetAlert`</SwmToken> method fetches the list of restock alerts from the API when the component is mounted.

```
    /**
     * Fetches the list of restock alerts from the API.
     * Called when the component is mounted.
     */
    async fetchGetAlert() {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/OverlayRestockAlert.vue" line="77">

---

The method includes a POST request to fetch AI predictions and a GET request to fetch the restock alerts. The results are stored in the <SwmToken path="/frontend/src/views/OverlayRestockAlert.vue" pos="87:3:3" line-data="        this.restockAlerts = result;">`restockAlerts`</SwmToken> array.

```

        await fetch("https://com.servhub.fr/api/alerts/ai", requestOptions2)
            .then((res) => {
              console.log("Fetching ia prediction successfully", res)})
            .catch(err => {
              console.log(err)})

        const response = await fetch("https://com.servhub.fr/api/alerts/", requestOptions);
        const result = await response.json();
        console.log("Fetched Restock Alerts:", result);
        this.restockAlerts = result;
        console.log("Alerts: ", this.restockAlerts);
      } catch (error) {
        console.error("Error fetching restock alerts:", error);
      }
    },
```

---

</SwmSnippet>

# Deleting restock alerts

<SwmSnippet path="/frontend/src/views/OverlayRestockAlert.vue" line="95">

---

The <SwmToken path="/frontend/src/views/OverlayRestockAlert.vue" pos="100:3:3" line-data="    async deleteAlert(alertId) {">`deleteAlert`</SwmToken> method deletes a specific restock alert by its ID. It sends a DELETE request to the API and updates the local alerts list upon success.

@param {String} <SwmToken path="/frontend/src/views/OverlayRestockAlert.vue" pos="100:5:5" line-data="    async deleteAlert(alertId) {">`alertId`</SwmToken> - The unique identifier of the alert to be deleted.

```
    /**
     * Deletes a specific restock alert by its ID.
     * Sends a DELETE request to the API and updates the local alerts list upon success.
     * @param {String} alertId - The unique identifier of the alert to be deleted.
     */
    async deleteAlert(alertId) {
      if (confirm("Are you sure you want to delete this restock alert?")) {
        const requestOptions = {
          method: "DELETE",
          redirect: "follow",
        };
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/views/OverlayRestockAlert.vue" line="106">

---

The method handles the response and updates the <SwmToken path="/frontend/src/views/OverlayRestockAlert.vue" pos="113:3:3" line-data="            this.restockAlerts = this.restockAlerts.filter(alert =&gt; alert._id !== alertId);">`restockAlerts`</SwmToken> array by removing the deleted alert.

```

        try {
          const response = await fetch(`https://com.servhub.fr/api/alerts/${alertId}`, requestOptions);
          if (response.ok) {
            const result = await response.json();
            console.log("Deleted Alert:", result);
            // Remove the deleted alert from the local list
            this.restockAlerts = this.restockAlerts.filter(alert => alert._id !== alertId);
            alert("Restock alert deleted successfully!");
          } else {
            const errorData = await response.json();
            console.error("Failed to delete alert:", errorData);
            alert(`Error deleting alert: ${errorData.message}`);
          }
        } catch (error) {
          console.error("Error deleting alert:", error);
          alert("An error occurred while deleting the alert.");
        }
      }
    },
  },
```

---

</SwmSnippet>

# Lifecycle hook

<SwmSnippet path="/frontend/src/views/OverlayRestockAlert.vue" line="128">

---

The <SwmToken path="/frontend/src/views/OverlayRestockAlert.vue" pos="129:17:17" line-data="   * Lifecycle hook called when the component is mounted.">`mounted`</SwmToken> lifecycle hook initiates the fetching of restock alerts when the component is mounted.

```
  /**
   * Lifecycle hook called when the component is mounted.
   * Initiates the fetching of restock alerts.
   */
  mounted() {

    this.fetchGetAlert();

  },
```

---

</SwmSnippet>

This concludes the walkthrough of the OverlayRestockAlert feature. The implementation ensures that restock alerts are fetched, displayed, and managed efficiently within the <SwmToken path="/frontend/src/views/OverlayRestockAlert.vue" pos="3:4:4" line-data="  Project: RetailHub">`RetailHub`</SwmToken> application.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBUmV0YWlsSFVCLUZyb250ZW5kJTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="RetailHUB-Frontend"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
