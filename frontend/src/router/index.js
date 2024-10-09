import { createRouter, createWebHistory } from 'vue-router'
import SaleStockView from "@/views/SaleStockView.vue";
import AdminView from "@/views/AdminView.vue";
import BagView from "@/views/BagView.vue";
import ClientSearchView from "@/views/ClientSearchView.vue";
import ClientView from "@/views/ClientView.vue";
import InvoiceSearchView from "@/views/InvoiceSearchView.vue";
import EmployeeView from "@/views/EmployeeView.vue";
import OverlayRestockAlert from "@/views/OverlayRestockAlert.vue";

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

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router

