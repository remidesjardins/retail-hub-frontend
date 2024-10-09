<!--
  =====================================================
  Project: RetailHub
  File: NavBar.vue
  Description: Component for the sidebar navigation, providing quick access to notifications, cart, inbox, and user profile.
  Participants:
    - Alexandre Borny
    - Maël Castellan
    - Laura Donato
    - Rémi Desjardins
  =====================================================
-->

<template>
  <!-- Sidebar container -->
  <div class="sidebar">
    <!-- Loop through each menu item to render its icon and bind its action -->
    <div
        v-for="(item, index) in menuItems"
        :key="index"
        class="menu-item"
        @click="item.action"
    >
      <!-- Icon for the menu item -->
      <i :class="item.icon"></i>
    </div>
  </div>
</template>

<script>
/**
 * Sidebar Component
 * Provides a vertical navigation sidebar with icons for notifications, cart, inbox, and user profile.
 */
export default {
  data() {
    return {
      /**
       * Array of menu items to be displayed in the sidebar.
       * Each item contains:
       * - icon: The FontAwesome icon class.
       * - action: The method to be executed on click.
       */
      menuItems: [
        {
          icon: 'fa-solid fa-bell',
          action: this.notifyFunction,
        }, // Notification icon
        {
          icon: "fa-solid fa-house",
          action: this.cartFunction,
        }, // Cart icon
        {
          icon: "fa-solid fa-file-invoice-dollar",
          action: this.inboxFunction,
        }, // Inbox icon
        {
          icon: 'fa-solid fa-user',
          action: this.profileFunction,
        }, // User profile icon
      ],
    };
  },
  methods: {
    /**
     * Displays a notification alert when the notification icon is clicked.
     */
    notifyFunction() {
      this.$router.push({name: "Alert"});
    },

    /**
     * Navigates the user to the Sales page when the cart icon is clicked.
     */
    cartFunction() {
      this.$router.push({ name: "Sale" });
    },

    /**
     * Navigates the user to the Client Search page when the inbox icon is clicked.
     */
    inboxFunction() {
      this.$router.push({ name: "ClientSearch" });
    },

    /**
     * Navigates the user to their profile page when the user icon is clicked.
     */
    profileFunction() {
      this.$router.push('/employee/66fdffb56790cc1514a6a267');
    },
  },
};
</script>

<style scoped>
.sidebar {
  position: fixed; /* Rendre la sidebar fixe sur le côté gauche */
  top: 0;
  left: 0;
  width: 3.75rem;
  height: 100vh; /* Utiliser 100vh pour la hauteur complète de l'écran */
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 1.25rem 0;
  overflow: hidden; /* Évite tout débordement */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.menu-item {
  padding: 1.25rem 0;
}

.menu-item i {
  font-size: 1.5rem;
  color: #000;
  cursor: pointer;
}

.menu-item i:hover {
  color: #274156; /* Changement de couleur au survol */
}
</style>