import { mount } from '@vue/test-utils';
import ClientSearchOverlay from '@/components/ClientSearchOverlay.vue'; // Change le chemin si nécessaire

describe('ClientSearchOverlay.vue', () => {
    let wrapper;

    beforeEach(() => {
        // Mocking fetch to simulate API call for clients
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve([
                        { id: 'client-1', name: 'John Doe', address: '123 Main St', phone: '123-456-7890', email: 'johndoe@example.com' },
                        { id: 'client-2', name: 'Jane Smith', address: '456 Oak St', phone: '987-654-3210', email: 'janesmith@example.com' },
                    ]),
            })
        );

        // Montre le composant avec des props de base
        wrapper = mount(ClientSearchOverlay, {
            props: {
                show: true, // Affiche l'overlay
            },
        });
    });

    afterEach(() => {
        wrapper.unmount();
        global.fetch.mockClear(); // Nettoie le mock
    });

    it('renders the overlay when mounted', () => {
        // Vérifie que l'overlay est rendu
        expect(wrapper.find('.overlay-container').exists()).toBe(true);
    });

    it('displays clients fetched from the API', async () => {
        // Attends que la promesse de fetch soit résolue et que les clients soient affichés
        await wrapper.vm.$nextTick();

        const clientCards = wrapper.findAll('.client-card');
        expect(clientCards.length).toBe(2);
        expect(clientCards.at(0).text()).toContain('John Doe');
        expect(clientCards.at(1).text()).toContain('Jane Smith');
    });

    it('filters clients based on search criteria', async () => {
        // Modifie le modèle de recherche pour filtrer les clients
        await wrapper.setData({
            search: {
                lastName: 'Doe',
                firstName: '',
                phoneNumber: '',
                email: '',
            },
        });

        // Attends que les changements soient appliqués
        await wrapper.vm.$nextTick();

        const clientCards = wrapper.findAll('.client-card');
        expect(clientCards.length).toBe(1);
        expect(clientCards.at(0).text()).toContain('John Doe');
    });

    it('emits close event when the close button is clicked', async () => {
        // Simule un clic sur le bouton de fermeture
        await wrapper.find('.close-button').trigger('click');

        // Vérifie que l'événement "close" est émis
        expect(wrapper.emitted().close).toBeTruthy();
    });

    it('emits close-data event when a client is selected', async () => {
        //Attends que la promesse de fetch soit résolue et que les clients soient affichés
        await wrapper.vm.$nextTick(); //Attends la première mise à jour du DOM
        await wrapper.vm.$nextTick(); //Attends une autre mise à jour pour garantir que les données sont disponibles

        // Simule un clic sur un client
        const clientCard = wrapper.findAll('.client-card').at(0);

        //Vérifie que le clientCard existe avant de déclencher l'évènement
        expect(clientCard.exists()).toBe(true);

        await clientCard.trigger('click');

        // Vérifie que l'événement "close-data" est émis avec les bonnes données
        expect(wrapper.emitted()['close-data']).toBeTruthy();
        expect(wrapper.emitted()['close-data'][0][0]).toEqual({
            id: 'client-1',
            name: 'John Doe',
            address: '123 Main St',
            phone: '123-456-7890',
            email: 'johndoe@example.com',
        });
    });

    it('opens the CreateClient component when the create client button is clicked', async () => {
        // Simule un clic sur le bouton pour créer un client
        await wrapper.find('.create-client-btn').trigger('click');

        // Vérifie que le composant CreateClient est rendu
        expect(wrapper.findComponent({ name: 'CreateClient' }).exists()).toBe(true);
    });
});