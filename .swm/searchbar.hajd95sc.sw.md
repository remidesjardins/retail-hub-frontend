---
title: SearchBar
---
# Introduction

This document will walk you through the implementation of the <SwmToken path="/frontend/src/components/SearchBar.vue" pos="2:7:7" line-data=" * RetailHub - SearchBar.vue">`SearchBar`</SwmToken> feature in the <SwmToken path="/frontend/src/components/SearchBar.vue" pos="2:3:3" line-data=" * RetailHub - SearchBar.vue">`RetailHub`</SwmToken> application.

The feature allows users to search for books within <SwmToken path="/frontend/src/components/SearchBar.vue" pos="2:3:3" line-data=" * RetailHub - SearchBar.vue">`RetailHub`</SwmToken> using a search bar component.

We will cover:

1. The purpose of the <SwmToken path="/frontend/src/components/SearchBar.vue" pos="2:7:7" line-data=" * RetailHub - SearchBar.vue">`SearchBar`</SwmToken> component.
2. How the search query is handled and emitted.
3. How the list of books is filtered based on the search query.

# Component purpose

<SwmSnippet path="/frontend/src/components/SearchBar.vue" line="1">

---

The <SwmToken path="/frontend/src/components/SearchBar.vue" pos="2:7:7" line-data=" * RetailHub - SearchBar.vue">`SearchBar`</SwmToken> component is designed to provide a user interface for searching books within <SwmToken path="/frontend/src/components/SearchBar.vue" pos="2:3:3" line-data=" * RetailHub - SearchBar.vue">`RetailHub`</SwmToken>. It is located at: <SwmPath>[frontend/src/components/SearchBar.vue](/frontend/src/components/SearchBar.vue)</SwmPath>

```
<!--
 * RetailHub - SearchBar.vue
 *
 * Participants:
 * - Alexandre Borny
 * - Maël Castellan
 * - Laura Donato
 * - Rémi Desjardins
 *
 * This component provides a search bar for users to search for books within RetailHub.
 -->
```

---

</SwmSnippet>

# Template structure

<SwmSnippet path="/frontend/src/components/SearchBar.vue" line="13">

---

The template defines the structure of the search bar. It includes an input field where users can type their search queries. The input field is bound to the <SwmToken path="/frontend/src/components/SearchBar.vue" pos="17:5:5" line-data="        :value=&quot;searchQuery&quot;">`searchQuery`</SwmToken> prop and emits the <SwmToken path="/frontend/src/components/SearchBar.vue" pos="14:7:7" line-data="  &lt;div class=&quot;search-bar&quot;&gt;">`search`</SwmToken> event whenever the input changes.

```
<template>
  <div class="search-bar">
    <input
        type="text"
        :value="searchQuery"
        @input="emitSearch($event.target.value)"
        placeholder="Search for a book..."
    />
  </div>
</template>
```

---

</SwmSnippet>

# Props

<SwmSnippet path="/frontend/src/components/SearchBar.vue" line="26">

---

The component accepts a single prop, <SwmToken path="/frontend/src/components/SearchBar.vue" pos="26:6:6" line-data="  props: [&quot;searchQuery&quot;],">`searchQuery`</SwmToken>, which holds the current search query input by the user.

```
  props: ["searchQuery"],
```

---

</SwmSnippet>

# Emitting search events

<SwmSnippet path="/frontend/src/components/SearchBar.vue" line="28">

---

The <SwmToken path="/frontend/src/components/SearchBar.vue" pos="34:1:1" line-data="    emitSearch(query) {">`emitSearch`</SwmToken> method is responsible for emitting the <SwmToken path="/frontend/src/components/SearchBar.vue" pos="30:8:8" line-data="     * Emits the &#39;search&#39; event with the current query to inform the parent component.">`search`</SwmToken> event with the current query. This informs the parent component about the user's input.

@param {string} <SwmToken path="/frontend/src/components/SearchBar.vue" pos="34:3:3" line-data="    emitSearch(query) {">`query`</SwmToken> - The current search query input by the user.

```
  methods: {
    /**
     * Emits the 'search' event with the current query to inform the parent component.
     *
     * @param {string} query - The current search query input by the user.
     */
    emitSearch(query) {
      this.$emit("search", query);
    }
  },
```

---

</SwmSnippet>

# Filtering books

<SwmSnippet path="/frontend/src/components/SearchBar.vue" line="39">

---

The <SwmToken path="/frontend/src/components/SearchBar.vue" pos="46:1:1" line-data="    filteredBooks() {">`filteredBooks`</SwmToken> computed property filters the list of books based on the search query. If the search query is empty, it returns all books. Otherwise, it filters books by title or book ID that match the search query.

@returns {Array} - An array of books that match the search criteria.

```
  computed: {
    /**
     * Computes and returns a filtered list of books based on the search query.
     * If the search query is empty, it returns all books.
     *
     * @returns {Array} - An array of books that match the search criteria.
     */
    filteredBooks() {
      console.log("Test SearchBar");

      // If the search query is empty, return all books
      if (this.searchQuery.trim() === "") {
        return this.books;
      }

      // Filter books by title or book ID matching the search query
      return this.books.filter(book => {
        return (
            book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            book.book_id.toString().includes(this.searchQuery.toLowerCase())
        );
      });
    },
  }
```

---

</SwmSnippet>

This concludes the walkthrough of the <SwmToken path="/frontend/src/components/SearchBar.vue" pos="2:7:7" line-data=" * RetailHub - SearchBar.vue">`SearchBar`</SwmToken> component. The implementation ensures that user input is handled efficiently and the list of books is filtered based on the search criteria.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBUmV0YWlsSFVCLUZyb250ZW5kJTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="RetailHUB-Frontend"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
