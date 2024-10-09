import { shallowMount } from '@vue/test-utils';
import InvoiceSearchView from '@/views/InvoiceSearchView.vue';

// Mock Vue Router
const mockRouter = {
    push: jest.fn()
};

// Mock the fetch API globally
global.fetch = jest.fn((url) => {
    if (url.includes('/api/sales')) {
        return Promise.resolve({
            json: () => Promise.resolve([
                { _id: 'sale1', total_price: 100, customer_id: 'customer1' },
                { _id: 'sale2', total_price: 150, customer_id: 'customer2' }
            ])
        });
    } else if (url.includes('/api/customers/')) {
        const customerId = url.split('/').pop();
        return Promise.resolve({
            json: () => Promise.resolve({ _id: customerId, name: `Customer ${customerId}` })
        });
    }
    return Promise.reject('Unknown URL');
});

describe('InvoiceSearchView.vue', () => {
    let wrapper;

    beforeEach(() => {
        // Mount the component with a mocked router
        wrapper = shallowMount(InvoiceSearchView, {
            global: {
                mocks: {
                    $router: mockRouter
                }
            },
            data() {
                return {
                    searchQuery: '',
                    activeTab: 'invoice',
                    sales: [],
                    filteredSales: [],
                };
            }
        });
    });

    afterEach(() => {
        // Clean up the wrapper after each test
        wrapper.unmount(); // Use unmount() for Vue 3
    });

    it('renders correctly', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('fetches sales on mount', async () => {
        await wrapper.vm.fetchSales(); // Simulate the fetchSales function
        expect(wrapper.vm.sales.length).toBe(2); // Ensure two sales were fetched
        expect(wrapper.vm.sales[0].customer.name).toBe('Customer customer1');
        expect(wrapper.vm.sales[1].customer.name).toBe('Customer customer2');
    });

    it('filters sales based on search query', async () => {
        await wrapper.vm.fetchSales(); // Ensure the sales are fetched

        wrapper.vm.searchSales('customer1');
        expect(wrapper.vm.filteredSales.length).toBe(1);
        expect(wrapper.vm.filteredSales[0].customer.name).toBe('Customer customer1');
    });

    it('switches to the correct tab when button is clicked', async () => {
        const clientTabButton = wrapper.findAll('button').at(0);
        await clientTabButton.trigger('click');

        expect(wrapper.vm.activeTab).toBe('client');
        expect(mockRouter.push).toHaveBeenCalledWith({ name: 'ClientSearch' });
    });

    it('displays all sales initially', async () => {
        await wrapper.vm.fetchSales(); // Ensure the sales are fetched

        expect(wrapper.vm.filteredSales.length).toBe(2);
        expect(wrapper.vm.filteredSales[0].customer.name).toBe('Customer customer1');
        expect(wrapper.vm.filteredSales[1].customer.name).toBe('Customer customer2');
    });
});