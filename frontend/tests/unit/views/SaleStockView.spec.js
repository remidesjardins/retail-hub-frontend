import { shallowMount } from '@vue/test-utils';
import BagView from '@/views/BagView.vue';
import Vuex from 'vuex';
import NavBar from '@/components/NavBar.vue';

describe('BagView.vue', () => {
    let store;
    let state;
    let mutations;
    let wrapper;

    beforeEach(() => {
        // Define the initial state and mutations
        state = {
            bagContents: [
                { product: { _id: '1', name: 'Product 1', price: 10, SKU: 'sku1', Image: 'img1' }, quantity: 2 },
                { product: { _id: '2', name: 'Product 2', price: 20, SKU: 'sku2', Image: 'img2' }, quantity: 1 }
            ]
        };

        mutations = {
            removeFromCartAndHandleReceipt: jest.fn(),
            updateQuantity: jest.fn(),
        };

        store = new Vuex.Store({
            state,
            mutations
        });

        wrapper = shallowMount(BagView, {
            global: {
                plugins: [store], // Use Vue 3 global property to inject Vuex store
                stubs: {
                    NavBar: true, // Stub NavBar to prevent its internal logic from interfering
                }
            }
        });
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.unmount(); // Use unmount instead of destroy in Vue 3
        }
    });

    it('renders NavBar and displays cart products', () => {
        expect(wrapper.findComponent(NavBar).exists()).toBe(true);
        expect(wrapper.findAll('.cart-item').length).toBe(2); // Check if two products are rendered
    });

    it('calculates the subtotal, tax, and total correctly', () => {
        expect(wrapper.vm.subtotal).toBe('40.00'); // 10 * 2 + 20 = 40
        expect(wrapper.vm.tax).toBe('2.90'); // 40 * 0.0725 = 2.90
        expect(wrapper.vm.total).toBe('42.90'); // 40 + 2.90 = 42.90
    });

    it('increases and decreases product quantity', async () => {
        // Increase quantity
        wrapper.vm.increaseQuantity(0, state.bagContents[0]);

        // Wait for the DOM to update after the mutation
        await wrapper.vm.$nextTick();

        // Check if the quantity increased
        expect(wrapper.vm.cartProducts[0].quantity).toBe(3);

        // Decrease quantity
        wrapper.vm.decreaseQuantity(0, state.bagContents[0]);

        // Wait for the DOM to update after the mutation
        await wrapper.vm.$nextTick();

        // Check if the quantity decreased
        expect(wrapper.vm.cartProducts[0].quantity).toBe(2);
    });

    it('removes a product from the cart', async () => {
        // Call the method to remove a product
        wrapper.vm.deleteProductFromCart(state.bagContents[0]);

        // Wait for the mutation to be triggered
        await wrapper.vm.$nextTick();

        // Check if the mutation was called
        expect(mutations.removeFromCartAndHandleReceipt).toHaveBeenCalledWith(expect.anything(), state.bagContents[0]);
    });

    it('opens and closes the client search overlay', async () => {
        wrapper.vm.openClientOverlay();
        expect(wrapper.vm.showClientSearch).toBe(true);

        wrapper.vm.closeClientOverlay();
        expect(wrapper.vm.showClientSearch).toBe(false);
    });

    it('sets client information when overlay is closed with data', async () => {
        const clientMock = { name: 'John Doe' };
        wrapper.vm.closeClientOverlayWithData(clientMock);
        expect(wrapper.vm.clientName).toBe('John Doe');
    });
});