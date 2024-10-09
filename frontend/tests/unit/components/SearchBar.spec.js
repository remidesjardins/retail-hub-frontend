import { mount } from '@vue/test-utils';
import SearchBar from '@/components/SearchBar.vue';

describe('SearchBar.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(SearchBar, {
            props: {
                searchQuery: 'Initial query', // Valeur initiale pour le champ de recherche
            },
        });
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders input with the correct initial value', () => {
        const input = wrapper.find('input');
        expect(input.element.value).toBe('Initial query'); // Vérifie que l'input a la bonne valeur initiale
    });

    it('emits search event with correct value on input', async () => {
        const input = wrapper.find('input');

        // Simule la saisie d'un texte
        await input.setValue('New search query');

        // Vérifie que l'événement 'search' est émis avec la bonne valeur
        expect(wrapper.emitted('search')).toBeTruthy();
        expect(wrapper.emitted('search')[0]).toEqual(['New search query']);
    });

    it('updates input value when searchQuery prop changes', async () => {
        // Modifie la prop searchQuery
        await wrapper.setProps({ searchQuery: 'Updated query' });

        const input = wrapper.find('input');
        expect(input.element.value).toBe('Updated query'); // Vérifie que l'input a été mis à jour
    });
});