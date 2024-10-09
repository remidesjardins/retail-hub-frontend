import { mount } from '@vue/test-utils';
import UpdateClient from '@/components/UpdateClient.vue';
import flushPromises from 'flush-promises'; // Assurez-vous d'installer flush-promises

// Mock global fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
            id: '123',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '1234567890',
            addressLine1: '123 Main St',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'USA',
        }),
    })
);

describe('UpdateClient.vue', () => {
    let wrapper;
    const mockClientData = {
        _id: '123',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        addressLine1: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
    };

    beforeEach(() => {
        global.fetch = jest.fn();
        wrapper = mount(UpdateClient, {
            props: {
                client: mockClientData,
            }
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly with provided client data', () => {
        // Vérifie que les données du client sont bien affichées dans le formulaire
        expect(wrapper.find('#name').element.value).toBe(mockClientData.name);
        expect(wrapper.find('#email').element.value).toBe(mockClientData.email);
        expect(wrapper.find('#phone').element.value).toBe(mockClientData.phone);
        expect(wrapper.find('input[placeholder="Street"]').element.value).toBe(mockClientData.addressLine1);
        expect(wrapper.find('input[placeholder="City"]').element.value).toBe(mockClientData.city);
        expect(wrapper.find('input[placeholder="State"]').element.value).toBe(mockClientData.state);
        expect(wrapper.find('input[placeholder="Postal Code"]').element.value).toBe(mockClientData.postalCode);
        expect(wrapper.find('input[placeholder="Country"]').element.value).toBe(mockClientData.country);
    });

    it('submits the form and makes the correct API call', async () => {

        // Simule la soumission du formulaire
        await wrapper.find('form').trigger('submit.prevent');

        // Vérifie que fetch a été appelé avec les bonnes données
        expect(global.fetch).toHaveBeenCalledWith(
            `https://com.servhub.fr/api/customers/${mockClientData._id}`,
            expect.objectContaining({
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: mockClientData.name,
                    email: mockClientData.email,
                    phone: mockClientData.phone,
                    address: {
                        addressLine1: mockClientData.addressLine1,
                        city: mockClientData.city,
                        state: mockClientData.state,
                        postalCode: mockClientData.postalCode,
                        country: mockClientData.country,
                    },
                }),
                redirect: 'follow'
            })
        );
    });

    it('emits close-data event with updated client data on successful update', async () => {
        global.fetch.mockResolvedVa ({
            ok: true,
            json: jest.fn().mockResolvedValue(mockClientData),
        });

        // Simule la soumission du formulaire
        await wrapper.find('form').trigger('submit.prevent');

        // Attends la mise à jour du DOM
        await wrapper.vm.$nextTick();

        // Vérifie que l'événement 'close-data' est bien émis avec les données du client mises à jour
        expect(wrapper.emitted()['close-data']).toBeTruthy();
        expect(wrapper.emitted()['close-data'][0]).toEqual([mockClientData]);
    });

    it('emits close event when close button is clicked', async () => {
        // Simule le clic sur le bouton de fermeture
        await wrapper.find('.close-button').trigger('click');

        // Vérifie que l'événement 'close' est bien émis
        expect(wrapper.emitted().close).toBeTruthy();
    });

    it('displays an alert on API failure', async () => {
        window.alert = jest.fn(); // Mock window.alert

        // Simule un échec de l'API
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ message: 'Error updating client' }),
            })
        );

        // Soumet le formulaire
        await wrapper.find('form').trigger('submit.prevent');

        await flushPromises();

        // Vérifie que l'alerte est affichée en cas d'échec
        expect(window.alert).toHaveBeenCalledWith('Error updating client: Error updating client');
    });

});
