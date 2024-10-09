---
title: Store
---
# Introduction

This document will walk you through the implementation of the store feature in the Vuex store located at <SwmPath>[frontend/src/store/index.js](/frontend/src/store/index.js)</SwmPath>.

The feature manages the state of a shopping cart, including adding, removing, and updating items, as well as handling stock levels.

We will cover:

1. Initializing the Vuex store.
2. Managing cart state with mutations.
3. Handling asynchronous actions.
4. Persisting state across sessions.

# Initializing the Vuex store

<SwmSnippet path="/frontend/src/store/index.js" line="5">

---

We start by creating the Vuex store and setting up the initial state.

```
const store = createStore({
    state: {
        bagContents: []
    },
```

---

</SwmSnippet>

# Managing cart state with mutations

Mutations are used to directly modify the state. Here are the key mutations:

## Adding items to the cart

<SwmSnippet path="/frontend/src/store/index.js" line="9">

---

The <SwmToken path="/frontend/src/store/index.js" pos="10:1:1" line-data="        addToCart: (state, payload) =&gt; {">`addToCart`</SwmToken> mutation adds an item to the cart or updates the quantity if it already exists.

```
    mutations: {
        addToCart: (state, payload) => {
            const existingItem = state.bagContents.find(item => item.product._id === payload._id);
            if (existingItem) {
                existingItem.quantity += 1; // Ajoute à la quantité existante
            } else {
                state.bagContents.push({ product: payload, quantity: 1}); // Ajoute le produit avec une quantité par défaut de 1
            }
            console.log("BAG CONTENT :", state.bagContents);
        },
```

---

</SwmSnippet>

## Removing items from the cart

<SwmSnippet path="/frontend/src/store/index.js" line="19">

---

The <SwmToken path="/frontend/src/store/index.js" pos="19:1:1" line-data="        removeFromCart: (state, payload) =&gt; {">`removeFromCart`</SwmToken> mutation removes an item from the cart based on its index.

```
        removeFromCart: (state, payload) => {
            console.log("Bag: ", state.bagContents);
            console.log("Payload :", payload);
            const index = state.bagContents.findIndex(item => item.product._id === payload.product._id);
            console.log("Index: ", index);
            if (index > -1) {
                state.bagContents.splice(index, 1); // Remove the item from the cart
            }
        },
```

---

</SwmSnippet>

## Removing all items from the cart

<SwmSnippet path="/frontend/src/store/index.js" line="28">

---

The <SwmToken path="/frontend/src/store/index.js" pos="28:1:1" line-data="        removeAllFromCart: (state) =&gt; {">`removeAllFromCart`</SwmToken> mutation clears the entire cart.

```
        removeAllFromCart: (state) => {
            state.bagContents = [];
        },
```

---

</SwmSnippet>

## Initializing bag contents

<SwmSnippet path="/frontend/src/store/index.js" line="31">

---

The <SwmToken path="/frontend/src/store/index.js" pos="31:1:1" line-data="        initialBagContents: (state) =&gt; {">`initialBagContents`</SwmToken> mutation sets the cart to an empty state.

```
        initialBagContents: (state) => {
            state.bagContents = [];
        },
```

---

</SwmSnippet>

## Updating item quantity

<SwmSnippet path="/frontend/src/store/index.js" line="34">

---

The <SwmToken path="/frontend/src/store/index.js" pos="34:1:1" line-data="        updateQuantity: (state, { _id, quantity }) =&gt; {">`updateQuantity`</SwmToken> mutation updates the quantity of a specific item in the cart.

```
        updateQuantity: (state, { _id, quantity }) => {
            const item = state.bagContents.find(item => item.product._id === _id);
            if (item) {
                item.quantity = quantity; // Met à jour la quantité du produit
            }
        },
```

---

</SwmSnippet>

## Checking ticket

<SwmSnippet path="/frontend/src/store/index.js" line="40">

---

The <SwmToken path="/frontend/src/store/index.js" pos="40:1:1" line-data="        checkTicket: (context, payload) =&gt; {">`checkTicket`</SwmToken> mutation checks if an item exists in the cart, removes it, and dispatches the <SwmToken path="/frontend/src/store/index.js" pos="44:6:6" line-data="                context.dispatch(&quot;handleReceipt&quot;, {payload: payload, number: 1});">`handleReceipt`</SwmToken> action.

```
        checkTicket: (context, payload) => {
            const item = context.state.bagContents.find(item => item.product._id === payload._id);
            if (item) {
                context.commit("removeFromCart", item);
                context.dispatch("handleReceipt", {payload: payload, number: 1});
            }
        },
    },
```

---

</SwmSnippet>

# Handling asynchronous actions

Actions handle asynchronous operations and can commit mutations or dispatch other actions.

## Handling check ticket

<SwmSnippet path="/frontend/src/store/index.js" line="48">

---

The <SwmToken path="/frontend/src/store/index.js" pos="49:3:3" line-data="        async handleCheckTicket({state, commit, dispatch}, payload) {">`handleCheckTicket`</SwmToken> action checks if an item exists in the cart, removes it, and dispatches the <SwmToken path="/frontend/src/store/index.js" pos="53:4:4" line-data="                dispatch(&quot;handleReceipt&quot;, {payload: payload, number: item.quantity});">`handleReceipt`</SwmToken> action.

```
    actions: {
        async handleCheckTicket({state, commit, dispatch}, payload) {
            const item = state.bagContents.find(item => item.product._id === payload._id);
            if (item) {
                commit("removeFromCart", item);
                dispatch("handleReceipt", {payload: payload, number: item.quantity});
            }
        },
```

---

</SwmSnippet>

## Removing from cart and handling receipt

<SwmSnippet path="/frontend/src/store/index.js" line="56">

---

The <SwmToken path="/frontend/src/store/index.js" pos="56:3:3" line-data="        async removeFromCartAndHandleReceipt({state, commit, dispatch }, payload) {">`removeFromCartAndHandleReceipt`</SwmToken> action removes an item from the cart and then handles the receipt.

```
        async removeFromCartAndHandleReceipt({state, commit, dispatch }, payload) {
            const existingItem = state.bagContents.find(item => item.product._id === payload.product._id);
            // Appeler la mutation pour supprimer du panier
            commit('removeFromCart', payload);

            // Appeler l'action handleReceipt après suppression
            await dispatch('handleReceipt', {payload: payload.product, number: existingItem.quantity});
        },
```

---

</SwmSnippet>

## Handling receipt

<SwmSnippet path="/frontend/src/store/index.js" line="64">

---

The <SwmToken path="/frontend/src/store/index.js" pos="64:3:3" line-data="        async handleReceipt(context, {payload, number}) {">`handleReceipt`</SwmToken> action fetches the current stock level, updates it, and handles errors.

```
        async handleReceipt(context, {payload, number}) {
            try {
                console.log("SKU: ", payload)
                console.log("Number: ", number)
                // Fetch the current stock level from the database
                const response = await fetch(`https://com.servhub.fr/api/products/${payload.SKU}`);
                const product = await response.json();
                console.log("SKU 2: ", product);

                if (!product || !product.Current_stock) {
                    alert("Product not found or no current stock information.");
                    return;
                }

                const newStockLevel = parseInt(product.Current_stock) + number;
                console.log(newStockLevel);

                // Update the stock level in the database
                const updateResponse = await fetch(`https://com.servhub.fr/api/products/${payload.SKU}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ Current_stock: newStockLevel }),
                });

                if (updateResponse.ok) {
                    console.log(`Stock updated successfully. New stock level: ${newStockLevel}`);
                } else {
                    alert("Failed to update stock level.");
                }
            } catch (error) {
                console.error("Error handling the receipt:", error);
                alert("An error occurred while processing the request.");
            }
        },
    },
```

---

</SwmSnippet>

# Persisting state across sessions

<SwmSnippet path="/frontend/src/store/index.js" line="101">

---

We use the <SwmToken path="/frontend/src/store/index.js" pos="3:7:9" line-data="import createPersistedState from &#39;vuex-persistedstate&#39;;">`vuex-persistedstate`</SwmToken> plugin to persist the state across sessions.

```
    plugins: [createPersistedState()],
```

---

</SwmSnippet>

This concludes the walkthrough of the store feature implementation. Each method is designed to manage the cart state effectively and handle stock levels accurately.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBUmV0YWlsSFVCLUZyb250ZW5kJTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="RetailHUB-Frontend"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
