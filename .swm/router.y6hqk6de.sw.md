---
title: Router
---
# Introduction

This document will walk you through the implementation of the router feature in the Vue.js application.

The router feature is responsible for defining the navigation paths and associating them with the corresponding views.

We will cover:

1. How routes are defined and why specific paths were chosen.
2. How dynamic route parameters are handled.
3. How the router is created and configured.

# Defining routes

<SwmSnippet path="/frontend/src/router/index.js" line="11">

---

We define the routes in <SwmPath>[frontend/src/router/index.js](/frontend/src/router/index.js)</SwmPath>. Each route specifies a path, a name, and the component to render.

```
const routes = [
    {
        path: '/',
        name: 'Sale',
        component: SaleStockView,
    },
    {
        path: '/admin',
        name: 'Admin',
        component: AdminView,
    },
    {
        path: '/bag',
        name: 'Bag',
        component: BagView,
    },
    {
        path: '/clientsearch',
        name: 'ClientSearch',
        component: ClientSearchView,
    },
    {
        path: '/client/:clientId',
        name: 'Client',
        component: ClientView,
        props: (route) => ({
            clientId: route.params.clientId,
        }),
    },
    {
        path: '/employee/:employeeId',
        name: 'Employee',
        component: EmployeeView,
        props: (route) => ({
            employeeId: route.params.employeeId,
        }),
    },
    {
        path: '/invoicesearch',
        name: 'InvoiceSearch',
        component: InvoiceSearchView,
    },
    {
        path: '/alert',
        name: 'Alert',
        component: OverlayRestockAlert,
    },
]
```

---

</SwmSnippet>

This snippet shows the routes array. Each object in the array represents a route. For example, the root path `/` renders the <SwmToken path="/frontend/src/router/index.js" pos="15:4:4" line-data="        component: SaleStockView,">`SaleStockView`</SwmToken> component, while <SwmToken path="/frontend/src/router/index.js" pos="18:5:6" line-data="        path: &#39;/admin&#39;,">`/admin`</SwmToken> renders the <SwmToken path="/frontend/src/router/index.js" pos="20:4:4" line-data="        component: AdminView,">`AdminView`</SwmToken> component. Dynamic routes like <SwmToken path="/frontend/src/router/index.js" pos="33:5:8" line-data="        path: &#39;/client/:clientId&#39;,">`/client/:clientId`</SwmToken> and <SwmToken path="/frontend/src/router/index.js" pos="41:5:8" line-data="        path: &#39;/employee/:employeeId&#39;,">`/employee/:employeeId`</SwmToken> use props to pass route parameters to the components.

# Creating the router

<SwmSnippet path="/frontend/src/router/index.js" line="60">

---

After defining the routes, we create the router instance using <SwmToken path="/frontend/src/router/index.js" pos="60:6:6" line-data="const router = createRouter({">`createRouter`</SwmToken> and <SwmToken path="/frontend/src/router/index.js" pos="61:4:4" line-data="    history: createWebHistory(),">`createWebHistory`</SwmToken>.

```
const router = createRouter({
    history: createWebHistory(),
    routes,
})

```

---

</SwmSnippet>

This snippet shows the creation of the router instance. The <SwmToken path="/frontend/src/router/index.js" pos="61:1:1" line-data="    history: createWebHistory(),">`history`</SwmToken> option is set to <SwmToken path="/frontend/src/router/index.js" pos="61:4:6" line-data="    history: createWebHistory(),">`createWebHistory()`</SwmToken> to use the HTML5 history mode, and the <SwmToken path="/frontend/src/router/index.js" pos="11:2:2" line-data="const routes = [">`routes`</SwmToken> option is set to the routes array defined earlier.

# Conclusion

This router setup allows for clear and maintainable navigation within the application. Each route is explicitly defined, and dynamic parameters are handled using props. This approach ensures that the application can easily scale with additional routes and views.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBUmV0YWlsSFVCLUZyb250ZW5kJTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="RetailHUB-Frontend"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
