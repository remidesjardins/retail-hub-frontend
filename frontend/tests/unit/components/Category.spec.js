import { mount } from '@vue/test-utils';
import Category from '@/components/Category.vue';
import flushPromises from "flush-promises";
import {defaultVueJestConfig} from "vue-jest/lib/constants.js";
import AddProductForm from "@/components/AddProductForm.vue";

describe ('Category.vue', () => {
    let wrapper;

    // Exécuté avant chaque test, mocke `fetch` et monte le composant
    beforeEach(() => {
        // Mocking fetch to simulate API call for categories
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve([
                        { _id: 'category-1', name: 'Category 1' },
                        { _id: 'category-2', name: 'Category 2' },
                    ]),
            })
        );

        // Montre le composant avec des props de base
        wrapper = mount(Category, {
            props: {
                show: true, // On affiche l'overlay
                categories: [
                    { _id: 'category-1', name: 'Category 1' },
                    { _id: 'category-2', name: 'Category 2' },
                ],
            },
        });
    });

    // Nettoyage après chaque test
    afterEach(() => {
        wrapper.unmount();
        global.fetch.mockClear(); // On s'assure que le mock est bien nettoyé
    });

    it('renders the overlay when "show" is true', () => {
        // Teste si l'overlay est rendu
        expect(wrapper.find('.overlay').exists()).toBe(true);
    });

    it('displays existing categories', () => {
        // Vérifie si les catégories passées via props sont affichées
        const categoryItems = wrapper.findAll('.category-item');
        expect(categoryItems.length).toBe(2); // 2 catégories doivent être rendues
        expect(categoryItems.at(0).text()).toContain('Category 1');
        expect(categoryItems.at(1).text()).toContain('Category 2');
    });

    it('adds a new category when form is submitted', async () => {
        // Mock la réponse API après avoir soumis une nouvelle catégorie
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        _id: 'category-3',
                        name: 'New Category',
                    }),
            })
        );

        // Utilise wrapper.vm pour accéder à la donnée
        wrapper.vm.newCategory ='New Category';

        //Simule la soumission du formulaire
        await wrapper.find('form').trigger('submit.prevent');

        // Vérifie que fetch a bien été appelé
        expect(global.fetch).toHaveBeenCalledWith(
            'https://com.servhub.fr/api/categories',
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'New Category' }),
            })
        );

        // Vérifie que l'événement `addCategory` a bien été émis
        expect(wrapper.emitted().addCategory).toBeTruthy();
        expect(wrapper.emitted().addCategory[0][0]).toEqual({
            _id: 'category-3',
            name: 'New Category',
        });
    });

    it('removes a category when the remove button is clicked', async () => {
        // Simule un clic sur le bouton de suppression de la première catégorie
        await wrapper.findAll('.remove-btn').at(0).trigger('click');

        // Vérifie que l'événement `removeCategory` a bien été émis
        expect(wrapper.emitted().removeCategory).toBeTruthy();
        expect(wrapper.emitted().removeCategory[0][0]).toEqual({
            _id: 'category-1',
            name: 'Category 1',
        });
    });

    it('closes the overlay when the close button is clicked', async () => {
        // Simule un clic sur le bouton de fermeture
        await wrapper.find('.close-btn').trigger('click');

        // Vérifie que l'événement `closeOverlay` a bien été émis
        expect(wrapper.emitted().closeOverlay).toBeTruthy();
    });
})