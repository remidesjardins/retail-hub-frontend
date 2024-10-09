import { mount } from '@vue/test-utils';
import Header from '@/components/Header.vue';
import SearchBar from '@/components/SearchBar.vue';

describe('Header.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(Header, {
            props: {
                searchQuery: 'Initial query', // Valeur initiale pour la prop searchQuery
            },
            global: {
                mocks: {
                    $router: {
                        push: jest.fn(), // Mock de la méthode $router.push
                    },
                },
            },
        });
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders SearchBar with the correct searchQuery prop', () => {
        const searchBar = wrapper.findComponent(SearchBar);
        expect(searchBar.props('searchQuery')).toBe('Initial query'); // Vérifie que la prop est transmise correctement
    });

    it('emits search event when SearchBar emits search', async () => {
        const searchBar = wrapper.findComponent(SearchBar);

        // Simule l'émission de l'événement 'search' par SearchBar
        await searchBar.vm.$emit('search', 'New search query');

        // Vérifie que l'événement 'search' est émis par Header
        expect(wrapper.emitted('search')).toBeTruthy();
        expect(wrapper.emitted('search')[0]).toEqual(['New search query']);
    });

    it('calls goToCart when cart icon is clicked', async () => {
        const cartIcon = wrapper.find('.icons');

        // Simule un clic sur l'icône du panier
        await cartIcon.trigger('click');

        // Vérifie que $router.push a été appelé avec la bonne route
        expect(wrapper.vm.$router.push).toHaveBeenCalledWith({ name: 'Bag' });
    });
});