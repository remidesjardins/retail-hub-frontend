---
title: NavBar
---
# Introduction

This document will walk you through the implementation of the <SwmToken path="/frontend/src/components/NavBar.vue" pos="4:4:4" line-data="  File: NavBar.vue">`NavBar`</SwmToken> component in the <SwmToken path="/frontend/src/components/NavBar.vue" pos="3:4:4" line-data="  Project: RetailHub">`RetailHub`</SwmToken> project.

The <SwmToken path="/frontend/src/components/NavBar.vue" pos="4:4:4" line-data="  File: NavBar.vue">`NavBar`</SwmToken> component provides quick access to notifications, cart, inbox, and user profile.

We will cover:

1. How the template is structured.
2. How the menu items are defined.
3. How each menu item action is handled.

# Template structure

<SwmSnippet path="/frontend/src/components/NavBar.vue" line="14">

---

The template defines the sidebar container and loops through each menu item to render its icon and bind its action.

```
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
```

---

</SwmSnippet>

# Defining menu items

<SwmSnippet path="/frontend/src/components/NavBar.vue" line="36">

---

The <SwmToken path="/frontend/src/components/NavBar.vue" pos="36:1:1" line-data="  data() {">`data`</SwmToken> function returns an array of menu items, each containing an icon and an action method.

```
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
          icon: 'fa-solid fa-cart-shopping',
          action: this.cartFunction,
        }, // Cart icon
        {
          icon: 'fa-solid fa-inbox',
          action: this.inboxFunction,
        }, // Inbox icon
        {
          icon: 'fa-solid fa-user',
          action: this.profileFunction,
        }, // User profile icon
      ],
    };
  },
```

---

</SwmSnippet>

# Handling menu item actions

Each menu item has a corresponding method that defines its action. These methods use Vue Router to navigate to different pages.

## Notification action

<SwmSnippet path="/frontend/src/components/NavBar.vue" line="65">

---

Navigates to the Alert page when the notification icon is clicked.

```
    /**
     * Displays a notification alert when the notification icon is clicked.
     */
    notifyFunction() {
      this.$router.push({name: "Alert"});
    },
```

---

</SwmSnippet>

## Cart action

<SwmSnippet path="/frontend/src/components/NavBar.vue" line="72">

---

Navigates to the Sales page when the cart icon is clicked.

```
    /**
     * Navigates the user to the Sales page when the cart icon is clicked.
     */
    cartFunction() {
      this.$router.push({ name: "Sale" });
    },
```

---

</SwmSnippet>

## Inbox action

<SwmSnippet path="/frontend/src/components/NavBar.vue" line="79">

---

Navigates to the Client Search page when the inbox icon is clicked.

```
    /**
     * Navigates the user to the Client Search page when the inbox icon is clicked.
     */
    inboxFunction() {
      this.$router.push({ name: "ClientSearch" });
    },
```

---

</SwmSnippet>

## Profile action

<SwmSnippet path="/frontend/src/components/NavBar.vue" line="86">

---

Navigates to the user's profile page when the user icon is clicked.

```
    /**
     * Navigates the user to their profile page when the user icon is clicked.
     */
    profileFunction() {
      this.$router.push('/employee/66fdffb56790cc1514a6a267');
    },
```

---

</SwmSnippet>

# Conclusion

This implementation ensures that each menu item in the <SwmToken path="/frontend/src/components/NavBar.vue" pos="4:4:4" line-data="  File: NavBar.vue">`NavBar`</SwmToken> component is interactive and navigates to the appropriate page when clicked. The use of Vue Router for navigation keeps the code clean and maintainable.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBUmV0YWlsSFVCLUZyb250ZW5kJTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="RetailHUB-Frontend"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
