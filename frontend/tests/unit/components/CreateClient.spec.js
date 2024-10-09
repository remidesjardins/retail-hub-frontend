import { shallowMount } from '@vue/test-utils';
import CreateClient from '@/components/CreateClient.vue';

describe('CreateClient.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(CreateClient);
    });

    afterEach(() => {
        wrapper.unmount(); // Clean up after each test
    });

    it('renders the form correctly', () => {
        expect(wrapper.find('h1').text()).toBe('Create Client');
        expect(wrapper.findAll('input').length).toBe(9); // Ensure there are 9 input fields
    });

    it('updates v-model when input fields change', async () => {
        const lastNameInput = wrapper.find('input[placeholder="Last Name"]');
        await lastNameInput.setValue('Doe');
        expect(wrapper.vm.client.lastName).toBe('Doe');

        const firstNameInput = wrapper.find('input[placeholder="First Name"]');
        await firstNameInput.setValue('John');
        expect(wrapper.vm.client.firstName).toBe('John');
    });

    it('emits close event when close button is clicked', async () => {
        const closeButton = wrapper.find('.close-button');
        await closeButton.trigger('click');
        expect(wrapper.emitted().close).toBeTruthy();
    });

    it('calls createClient method when form is submitted', async () => {
        // Mock the method directly
        wrapper.vm.createClient = jest.fn();
        await wrapper.find('form').trigger('submit.prevent');
        expect(wrapper.vm.createClient).toHaveBeenCalled();
    });

    it('submits the form and creates client object with correct data', async () => {
        // Set up form data
        await wrapper.setData({
            client: {
                lastName: 'Doe',
                firstName: 'John',
                phoneNumber: '123456789',
                email: 'john.doe@example.com',
                addressLine1: '123 Main St',
                city: 'Anytown',
                state: 'CA',
                postalCode: '12345',
                country: 'USA'
            }
        });

        // Mock createClient method
        wrapper.vm.createClient = jest.fn();

        // Simulate form submission
        await wrapper.find('form').trigger('submit.prevent');

        // Check if the client data was correctly set
        expect(wrapper.vm.createClient).toHaveBeenCalled();
        expect(wrapper.vm.client.lastName).toBe('Doe');
        expect(wrapper.vm.client.firstName).toBe('John');
    });

    it('sends the correct data when createClient is called', async () => {
        // Mock fetch
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ success: true })
            })
        );

        // Set up client data
        await wrapper.setData({
            client: {
                lastName: 'Doe',
                firstName: 'John',
                phoneNumber: '123456789',
                email: 'john.doe@example.com',
                addressLine1: '123 Main St',
                city: 'Anytown',
                state: 'CA',
                postalCode: '12345',
                country: 'USA'
            }
        });

        // Call createClient
        await wrapper.vm.createClient();

        // Check if fetch was called with correct data
        const expectedData = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '123456789',
            address: '123 Main St, Anytown, CA, 12345, USA'
        };
        expect(global.fetch).toHaveBeenCalledWith(
            'https://com.servhub.fr/api/customers/',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify(expectedData),
                headers: expect.any(Headers)
            })
        );
    });
});