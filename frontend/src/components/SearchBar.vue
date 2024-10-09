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

<template>
  <div class="search-bar">
    <input
        type="text"
        :value="searchQuery"
        @input="emitSearch($event.target.value)"
        placeholder="Search..."
    />
  </div>
</template>

<script>
export default {
  props: ["searchQuery"],

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
};
</script>


<style scoped>

.search-bar {
  flex-grow: 1;
  margin: 0 1.25rem;
}

.search-bar input {
  width: 100%;
  padding: .625rem;
  font-size: 1rem;
  border: 2px solid black;
  border-radius: 1.875rem;
  background: white;
}

.search-bar input::placeholder {
  color: black;
}

</style>
