import { shallowMount } from '@vue/test-utils';
import ClientView from '@/views/ClientView.vue';

// Mock Vue Router
const mockRouter = {
    push: jest.fn()
};

// Mock the fetch API globally
global.fetch = jest.fn((url) => {
    if (url.includes('/api/customers/')) {
        return Promise.resolve({
            json: () => Promise.resolve({
                _id: 'client1',
                name: 'John Doe',
                address: '123 Main St',
                phone: '1234567890',
                email: 'john.doe@example.com'
            })
        });
    } else if (url.includes('/api/sales')) {
        return Promise.resolve({
            json: () => Promise.resolve([
                {
                    _id: 'sale1',
                    total_price: 100,
                    customer_id: 'client1',
                    sale_date: new Date().toISOString(),
                    payment_status: 'Completed'
                },
                {
                    _id: 'sale2',
                    total_price: 200,
                    customer_id: 'wrongClientId', // Does not match
                    sale_date: new Date().toISOString(),
                    payment_status: 'Completed'
                }
            ])
        });
    }
    return Promise.reject('Unknown URL');
});

describe('ClientView.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(ClientView, {
            global: {
                mocks: {
                    $router: mockRouter
                }
            },
            propsData: {
                clientId: 'client1'
            },
            data() {
                return {
                    client: {},
                    filteredSales: [],
                    sales: [],
                    showUpdateClient: false,
                    clientCopy: {},
                    activeTab: 'client'
                };
            }
        });
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders correctly', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('fetches client info and sales on mount', async () => {
        await wrapper.vm.fetchClientInfo();
        await wrapper.vm.fetchSales();

        // Check client info
        expect(wrapper.vm.client.name).toBe('John Doe');
        expect(wrapper.vm.client.address).toBe('123 Main St');

        // Check sales
        expect(wrapper.vm.sales.length).toBe(1); // Only one matching sale for client1
        expect(wrapper.vm.sales[0].total_price).toBe(100);
    });

    it('filters and displays client sales', async () => {
        await wrapper.vm.fetchSales();

        expect(wrapper.vm.filteredSales.length).toBe(1); // Only one matching sale for client1
        expect(wrapper.vm.filteredSales[0].total_price).toBe(100);
    });

    it('opens and closes the update client modal', async () => {
        // Simulate opening the client edit modal
        wrapper.vm.editClientInfo();
        expect(wrapper.vm.showUpdateClient).toBe(true);
        expect(wrapper.vm.clientCopy).toEqual(wrapper.vm.client);

        // Simulate closing the client edit modal
        wrapper.vm.closeUpdateClient();
        expect(wrapper.vm.showUpdateClient).toBe(false);
    });

    it('updates client info', async () => {
        const updatedClient = {
            _id: 'client1',
            name: 'Jane Doe',
            address: '456 Another St',
            phone: '0987654321',
            email: 'jane.doe@example.com'
        };

        wrapper.vm.updateClient(updatedClient);
        expect(wrapper.vm.client).toEqual(updatedClient);
        expect(wrapper.vm.showUpdateClient).toBe(false); // Ensure modal is closed
    });

    it('switches to the correct tab when button is clicked', async () => {
        const clientTabButton = wrapper.findAll('button').at(0);
        await clientTabButton.trigger('click');
        expect(wrapper.vm.activeTab).toBe('client');
        expect(mockRouter.push).toHaveBeenCalledWith({ name: 'ClientSearch' });

        const invoiceTabButton = wrapper.findAll('button').at(1);
        await invoiceTabButton.trigger('click');
        expect(wrapper.vm.activeTab).toBe('invoice');
        expect(mockRouter.push).toHaveBeenCalledWith({ name: 'InvoiceSearch' });
    });
});