import { mount } from '@vue/test-utils';
import ModifyProductForm from '@/components/ModifyProductForm.vue';
import CategoryOverlay from '@/components/Category.vue'; // Importation du composant CategoryOverlay

jest.mock('@/components/Category.vue'); // Mock du composant CategoryOverlay

describe('ModifyProductForm.vue', () => {
    let wrapper;
    const mockProductSKU = '12345';
    const mockCategories = [
        { _id: '1', name: 'Category 1' },
        { _id: '2', name: 'Category 2' },
    ];

    beforeEach(() => {
        // Mock de la méthode fetch pour renvoyer des produits et des catégories
        global.fetch = jest.fn((url) => {
            if (url.includes('categories')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockCategories),
                });
            }
            if (url.includes(mockProductSKU)) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        name: 'Sample Product',
                        SKU: mockProductSKU,
                        price: 100,
                        Details: 'Product details here',
                        Image: 'http://example.com/image.jpg',
                        Slot: 'A1',
                    }),
                });
            }
            return Promise.reject(new Error('Unknown URL'));
        });

        wrapper = mount(ModifyProductForm, {
            props: {
                productSKU: mockProductSKU,
            },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
        wrapper.unmount();
    });

    it('fetches product details on mount', async () => {
        // Attendre que le composant soit monté et que les données soient chargées
        await wrapper.vm.$nextTick();
        await wrapper.vm.fetchProductDetails(); //Appelle la méthode pour s'assurer que les données sont chargées
        expect(wrapper.vm.product).toEqual({
            name: 'Sample Product',
            SKU: mockProductSKU,
            price: 100,
            Details: 'Product details here',
            Image: 'http://example.com/image.jpg',
            Slot: 'A1',
            category: '',
        });
    });

    it('fetches categories on created', async () => {
        await wrapper.vm.$nextTick(); // Attendre que le DOM soit mis à jour
        expect(wrapper.vm.categories).toEqual(mockCategories);
    });

    it('modifies product and emits close event', async () => {
        await wrapper.vm.$nextTick(); // Assurez-vous que le DOM est à jour

        // Remplir les champs du formulaire
        wrapper.vm.product.name = 'Updated Product';
        wrapper.vm.product.SKU = 'updated-sku';
        wrapper.vm.product.price = 150;
        wrapper.vm.product.Image = 'http://example.com/updated-image.jpg';
        wrapper.vm.product.Slot = 'B1';
        wrapper.vm.selectedCategory = mockCategories[0]._id; // Sélectionner une catégorie

        // Simuler la soumission du formulaire
        await wrapper.find('form').trigger('submit.prevent');

        // Vérifiez que l'événement close a été émis
        expect(wrapper.emitted().close).toBeTruthy();
    });

    it('opens and closes the category overlay', async () => {
        // Ouvrir la superposition de catégories
        await wrapper.vm.openCategoryOverlay();
        expect(wrapper.vm.showCategoryOverlay).toBe(true);

        // Fermer la superposition de catégories
        await wrapper.vm.closeCategoryOverlay();
        expect(wrapper.vm.showCategoryOverlay).toBe(false);
    });

    it('adds a new category', async () => {
        const newCategory = { _id: '3', name: 'Category 3' };

        // Simuler l'ajout d'une nouvelle catégorie
        await wrapper.vm.addCategory(newCategory);

        // Vérifiez que la nouvelle catégorie a été ajoutée
        expect(wrapper.vm.categories).toContainEqual(newCategory);
        expect(wrapper.vm.selectedCategory).toBe(newCategory._id); // Vérifiez que la catégorie sélectionnée est la nouvelle catégorie
    });

    it('removes a category', async () => {
        const categoryToRemove = mockCategories[0];

        // Simuler la suppression de la catégorie
        await wrapper.vm.removeCategory(categoryToRemove);

        // Vérifiez que la catégorie a été supprimée
        expect(wrapper.vm.categories).not.toContainEqual(categoryToRemove);
    });
});