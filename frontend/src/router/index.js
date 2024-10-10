import { createRouter, createWebHistory } from 'vue-router'
import SaleStockView from "@/views/SaleStockView.vue";
import AdminView from "@/views/AdminView.vue";
import BagView from "@/views/BagView.vue";
import ClientSearchView from "@/views/ClientSearchView.vue";
import ClientView from "@/views/ClientView.vue";
import InvoiceSearchView from "@/views/InvoiceSearchView.vue";
import EmployeeView from "@/views/EmployeeView.vue";
import OverlayRestockAlert from "@/views/OverlayRestockAlert.vue";
import LogIn from "@/views/LogIn.vue";
import store from '@/store'

const routes = [
    {
        path: '/',
        name: 'Sale',
        component: SaleStockView,
        meta: { requiresAuth: true },
    },
    {
        path: '/admin',
        name: 'Admin',
        component: AdminView,
        meta: { requiresAuth: true },
    },
    {
        path: '/bag',
        name: 'Bag',
        component: BagView,
        meta: { requiresAuth: true },
    },
    {
        path: '/clientsearch',
        name: 'ClientSearch',
        component: ClientSearchView,
        meta: { requiresAuth: true },
    },
    {
        path: '/client/:clientId',
        name: 'Client',
        component: ClientView,
        meta: { requiresAuth: true },
        props: (route) => ({
            clientId: route.params.clientId,
        }),
    },
    {
        path: '/employee/:employeeId',
        name: 'Employee',
        component: EmployeeView,
        meta: { requiresAuth: true },
        props: (route) => ({
            employeeId: route.params.employeeId,
        }),
    },
    {
        path: '/invoicesearch',
        name: 'InvoiceSearch',
        component: InvoiceSearchView,
        meta: { requiresAuth: true },
    },
    {
        path: '/alert',
        name: 'Alert',
        component: OverlayRestockAlert,
        meta: { requiresAuth: true },
    },
    {
        path: '/login',
        name: 'Login',
        component: LogIn,
    },

]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    if (requiresAuth && !store.state.isAuthenticated) {
        next('/login');  // Redirect to login if not authenticated
    } else {
        next();  // Continue if authenticated or no auth required
    }
});

export default router

