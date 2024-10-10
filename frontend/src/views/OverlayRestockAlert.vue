<!--
  =====================================================
  Project: RetailHub
  File: RestockAlert.vue
  Description: Component for displaying and managing restock alerts within RetailHub.
  Participants:
    - Alexandre Borny
    - Maël Castellan
    - Laura Donato
    - Rémi Desjardins
  =====================================================
-->

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

<script>
/**
 * RestockAlert Component
 * Displays a list of restock alerts and provides functionalities to manage them.
 */
import NavBar from "@/components/NavBar.vue";

export default {
  components: {
    NavBar,
  },

  data() {
    return {
      /**
       * Array holding all restock alerts fetched from the API.
       * @type {Array}
       */
      restockAlerts: [],
    };
  },

  methods: {
    /**
     * Fetches the list of restock alerts from the API.
     * Called when the component is mounted.
     */
    async fetchGetAlert() {
      const token = localStorage.getItem('authToken');
      const requestOptions = {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        redirect: "follow",
      };

      const requestOptions2 = {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        redirect: "follow",
      };

      try {
        await fetch("https://com.servhub.fr/api/alerts/ai", requestOptions2)
            .then((res) => {
              console.log("Fetching AI prediction successfully", res);
            })
            .catch(err => {
              console.log(err);
            });

        const response = await fetch("https://com.servhub.fr/api/alerts/", requestOptions);
        const result = await response.json();
        console.log("Fetched Restock Alerts:", result);
        this.restockAlerts = result;
        console.log("Alerts: ", this.restockAlerts);
      } catch (error) {
        console.error("Error fetching restock alerts:", error);
      }
    },


    /**
     * Deletes a specific restock alert by its ID.
     * Sends a DELETE request to the API and updates the local alerts list upon success.
     * @param {String} alertId - The unique identifier of the alert to be deleted.
     */
    async deleteAlert(alertId) {
      if (confirm("Are you sure you want to delete this restock alert?")) {
        const token = localStorage.getItem('authToken');
        const requestOptions = {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          redirect: "follow",
        };

        try {
          const response = await fetch(`https://com.servhub.fr/api/alerts/${alertId}`, requestOptions);
          if (response.ok) {
            const result = await response.json();
            console.log("Deleted Alert:", result);
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

  /**
   * Lifecycle hook called when the component is mounted.
   * Initiates the fetching of restock alerts.
   */
  mounted() {

    this.fetchGetAlert();

  },
};
</script>

<style scoped>
.restocks-container {
  margin-left: 4%;
  max-width: 80%;
  padding: 2rem;
  background-color: #d0e7eb;
  border-radius: 1rem;
  position: relative;
  height: calc(100vh - 4rem);
  overflow-y: auto;
}

.restocks-container h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1.5rem;
  letter-spacing: 0.05rem;
}

.alert-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.alerts {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.alerts:hover {
  transform: translateY(-10px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.alert-product {
  font-size: 1.4rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05rem;
}

.alert-details {
  font-size: 1.1rem;
  color: #666;
  margin-top: 0.5rem;
  line-height: 1.5;
}

.check-icon {
  font-size: 2rem;
  color: #28a745;
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.check-icon:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media only screen and (max-width: 768px) {
  .restocks-container {
    margin-left: 12%;
    max-width: 75%;
    padding: 1.5rem;
  }

  .alerts {
    padding: 1.2rem;
  }

  .check-icon {
    font-size: 1.6rem;
  }

  .alert-product {
    font-size: 1.3rem;
  }

  .alert-details {
    font-size: 1rem;
  }
}

@media only screen and (max-width: 480px) {
  .restocks-container {
    margin-left: 12%;
    max-width: 70%;
    padding: 1rem;
    height: calc(100vh - 4rem);
  }

  .alerts {
    padding: 1rem;
  }

  .check-icon {
    font-size: 1.5rem;
  }

  .alert-product {
    font-size: 1.1rem;
  }

  .alert-details {
    font-size: 0.9rem;
  }
}
</style>