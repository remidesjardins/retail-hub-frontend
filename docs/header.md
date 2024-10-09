---
title: Header
---
# Introduction

This document will walk you through the implementation of the Header component in the <SwmToken path="/frontend/src/components/Header.vue" pos="3:4:4" line-data="  Project: RetailHub">`RetailHub`</SwmToken> project.

The Header component includes search functionality and cart navigation.

We will cover:

1. How the search functionality is implemented.
2. How the cart navigation is handled.
3. The integration of child components and event handling.

# Component template

<SwmSnippet path="/frontend/src/components/Header.vue" line="14">

---

The template defines the structure of the Header component. It includes a <SwmToken path="/frontend/src/components/Header.vue" pos="17:3:3" line-data="    &lt;!-- SearchBar component with two-way binding for searchQuery and emitting search events --&gt;">`SearchBar`</SwmToken> component for search functionality and a clickable shopping cart icon for navigation.

```
<template>
  <!-- Main header container -->
  <header class="header">
    <!-- SearchBar component with two-way binding for searchQuery and emitting search events -->
    <SearchBar :searchQuery="searchQuery" @search="emitSearchQuery" />

    <!-- Shopping cart icon with click event to navigate to the cart page -->
    <div class="icons" @click="goToCart">
      <i class="fa fa-shopping-cart"></i>
    </div>
  </header>
</template>
```

---

</SwmSnippet>

# Props

<SwmSnippet path="/frontend/src/components/Header.vue" line="37">

---

The Header component receives a <SwmToken path="/frontend/src/components/Header.vue" pos="39:10:10" line-data="   * @prop {String} searchQuery - The current search query entered by the user.">`searchQuery`</SwmToken> prop from its parent component. This prop holds the current search query entered by the user.

@prop {String} <SwmToken path="/frontend/src/components/Header.vue" pos="41:6:6" line-data="  props: [&#39;searchQuery&#39;],">`searchQuery`</SwmToken> - The current search query entered by the user.

```
  /**
   * Props received from the parent component.
   * @prop {String} searchQuery - The current search query entered by the user.
   */
  props: ['searchQuery'],
```

---

</SwmSnippet>

# Child components

<SwmSnippet path="/frontend/src/components/Header.vue" line="43">

---

The Header component integrates the <SwmToken path="/frontend/src/components/Header.vue" pos="44:1:1" line-data="    SearchBar,">`SearchBar`</SwmToken> component, which is responsible for handling user search input.

```
  components: {
    SearchBar,
  },
```

---

</SwmSnippet>

# Emitting search events

<SwmSnippet path="/frontend/src/components/Header.vue" line="48">

---

The <SwmToken path="/frontend/src/components/Header.vue" pos="52:1:1" line-data="    emitSearchQuery(query) {">`emitSearchQuery`</SwmToken> method emits the search query to the parent component when a search is performed. This allows the parent component to handle the search logic.

@param {String} <SwmToken path="/frontend/src/components/Header.vue" pos="52:3:3" line-data="    emitSearchQuery(query) {">`query`</SwmToken> - The search query entered by the user.

```
    /**
     * Emits the search query to the parent component when a search is performed.
     * @param {String} query - The search query entered by the user.
     */
    emitSearchQuery(query) {
      this.$emit("search", query);
    },
```

---

</SwmSnippet>

# Cart navigation

<SwmSnippet path="/frontend/src/components/Header.vue" line="56">

---

The <SwmToken path="/frontend/src/components/Header.vue" pos="59:1:1" line-data="    goToCart() {">`goToCart`</SwmToken> method navigates the user to the shopping cart page when the cart icon is clicked. This method uses Vue Router to change the route.

```
    /**
     * Navigates the user to the shopping cart page when the cart icon is clicked.
     */
    goToCart() {
      this.$router.push({ name: "Bag" });
    }
```

---

</SwmSnippet>

# Conclusion

This document explained the key design decisions and implementation details of the Header component in the <SwmToken path="/frontend/src/components/Header.vue" pos="3:4:4" line-data="  Project: RetailHub">`RetailHub`</SwmToken> project. The Header component integrates search functionality and cart navigation, making use of props, child components, and event handling to achieve its functionality.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBUmV0YWlsSFVCLUZyb250ZW5kJTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="RetailHUB-Frontend"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
