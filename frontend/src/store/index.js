import { createStore } from 'vuex';
import router from '@/router';
import createPersistedState from 'vuex-persistedstate';

const store = createStore({
    state: {
        bagContents: [],
        isAuthenticated: !!localStorage.getItem('authToken'),
        userToken: localStorage.getItem('authToken'),
        userId: localStorage.getItem('userId'),
        userIsAdmin: localStorage.getItem('role'),
    },
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
        removeFromCart: (state, payload) => {
            console.log("Bag: ", state.bagContents);
            console.log("Payload :", payload);
            const index = state.bagContents.findIndex(item => item.product._id === payload.product._id);
            console.log("Index: ", index);
            if (index > -1) {
                state.bagContents.splice(index, 1); // Remove the item from the cart
            }
        },
        removeAllFromCart: (state) => {
            state.bagContents = [];
        },
        initialBagContents: (state) => {
            state.bagContents = [];
        },
        updateQuantity: (state, { _id, quantity }) => {
            const item = state.bagContents.find(item => item.product._id === _id);
            if (item) {
                item.quantity = quantity; // Met à jour la quantité du produit
            }
        },
        checkTicket: (context, payload) => {
            const item = context.state.bagContents.find(item => item.product._id === payload._id);
            if (item) {
                context.commit("removeFromCart", item);
                context.dispatch("handleReceipt", {payload: payload, number: 1});
            }
        },
        login(state, { authToken, userId, userRole }) {
            state.isAuthenticated = true;
            state.userToken = authToken;
            state.userId = userId;
            state.userIsAdmin = userRole === "ADMIN";
        },
        logout(state) {
            state.isAuthenticated = false;
            state.userToken = '';
            state.userId = undefined;
        },
    },
    actions: {
        async handleCheckTicket({state, commit, dispatch}, payload) {
            const item = state.bagContents.find(item => item.product._id === payload._id);
            if (item) {
                commit("removeFromCart", item);
                dispatch("handleReceipt", {payload: payload, number: item.quantity});
            }
        },
        async removeFromCartAndHandleReceipt({state, commit, dispatch }, payload) {
            const existingItem = state.bagContents.find(item => item.product._id === payload.product._id);
            // Appeler la mutation pour supprimer du panier
            commit('removeFromCart', payload);

            // Appeler l'action handleReceipt après suppression
            await dispatch('handleReceipt', {payload: payload.product, number: existingItem.quantity});
        },
        async handleReceipt(context, {payload, number}) {
            try {
                console.log("SKU: ", payload)
                console.log("Number: ", number)
                // Fetch the current stock level from the database

                const token = context.state.userToken;
                console.log("Token: ", token);

                const requestOptions = {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                };

                const response = await fetch(`https://com.servhub.fr/api/products/${payload.SKU}`, requestOptions);
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
                        'Authorization': `Bearer ${token}`,
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
        async login({ commit }, { email, password }) {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            };

            try {
                const response = await fetch("https://com.servhub.fr/api/users/login", requestOptions);
                const result = await response.json();

                if (response.ok && result.token) {
                    console.log("Token store: ", result.token);
                    localStorage.setItem('authToken', result.token);  // Store the token locally
                    localStorage.setItem('userId', result.userId);  // Store the user ID locally
                    localStorage.setItem('role', result.userRole === "ADMIN");
                    commit("login", { authToken: result.token, userId: result.userId, userRole: result.userRole});
                    router.push('/');  // Redirect to home page after successful login
                } else {
                    throw new Error(result.message || "Login failed");
                }
            } catch (error) {
                console.error("Login error:", error);
                alert("Login failed: " + error.message);  // Show the user an error message
            }
        },
        logout({ commit }) {
            commit('logout');
            localStorage.removeItem('authToken');
            console.log('User logged out, redirecting to login...');  // Add a debug statement
            router.push('/login');
        }
    },
    plugins: [createPersistedState()],
});

export default store;