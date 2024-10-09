import { shallowMount } from '@vue/test-utils';
import ClientSearchView from '@/views/ClientSearchView.vue';

// Mock Vue Router
const mockRouter = {
    push: jest.fn()
};

// Mock the fetch API globally to avoid errors during the test
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve([
            { id: 1, name: 'John Doe', phone: '123456789', email: 'john@example.com', address: '123 Main St' },
            { id: 2, name: 'Jane Smith', phone: '987654321', email: 'jane@example.com', address: '456 Second St' }
        ]), // Mock the API response (clients list)
    })
);

describe('ClientSearchView.vue', () => {
    let wrapper;

    beforeEach(() => {
        // Create a wrapper instance before each test with mocked router
        wrapper = shallowMount(ClientSearchView, {
            global: {
                mocks: {
                    $router: mockRouter // Mock Vue Router
                }
            },
            data() {
                return {
                    activeTab: 'client',
                    search: {
                        lastName: '',
                        firstName: '',
                        phoneNumber: '',
                        email: '',
                    },
                    clients: [],
                    showCreateClient: false,
                };
            },
        });
    });

    afterEach(() => {
        // Clean up the wrapper after each test
        wrapper.unmount(); // Use unmount() for Vue 3
    });

    it('renders correctly', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('filters clients based on last name', () => {
        // Set search.lastName directly
        wrapper.vm.$data.search.lastName = 'Doe';
        const filteredClients = wrapper.vm.filteredClients;
        expect(filteredClients.length).toBe(1);
        expect(filteredClients[0].name).toBe('John Doe');
    });

    it('filters clients based on email', async () => {
        // Set search.email directly
        wrapper.vm.$data.search.email = 'jane@example.com';
        const filteredClients = wrapper.vm.filteredClients;
        expect(filteredClients.length).toBe(1);
        expect(filteredClients[0].name).toBe('Jane Smith');
    });

    it('switches to the correct tab when button is clicked', async () => {
        const invoiceTabButton = wrapper.findAll('button').at(1);
        await invoiceTabButton.trigger('click');

        expect(wrapper.vm.activeTab).toBe('invoice');
        expect(mockRouter.push).toHaveBeenCalledWith({ name: 'InvoiceSearch' });
    });

    it('opens create client modal when button is clicked', async () => {
        const createClientButton = wrapper.find('.create-client-btn');
        await createClientButton.trigger('click');
        expect(wrapper.vm.showCreateClient).toBe(true);
    });

    it('renders the list of clients', async () => {
        await wrapper.vm.fetchInitialClients(); // Ensure fetch is called
        const clientCards = wrapper.findAll('.client-card');
        expect(clientCards.length).toBe(2);
        expect(clientCards.at(0).text()).toContain('John Doe');
        expect(clientCards.at(1).text()).toContain('Jane Smith');
    });
});