import { mount } from '@vue/test-utils';
import AddProductForm from '@/components/AddProductForm.vue';
import flushPromises from 'flush-promises'; // Import flush-promises to wait for fetches

describe('AddProductForm.vue', () => {
    let wrapper;

    beforeEach(() => {
        // Mocking fetch to return categories for the dropdown

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
        wrapper = mount(AddProductForm);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the form correctly', () => {
        expect(wrapper.exists()).toBe(true);
        const form = wrapper.find('form');
        expect(form.exists()).toBe(true);
    });

    it('renders category options correctly', async () => {
        await flushPromises(); // Wait for the fetch request to resolve
        const categoryOptions = wrapper.findAll('option');
        expect(categoryOptions.length).toBe(2); // Ensure both categories are rendered
        expect(categoryOptions.at(0).text()).toBe('Category 1');
        expect(categoryOptions.at(1).text()).toBe('Category 2');
    });

    it('updates data when input values change', async () => {
        const productNameInput = wrapper.find('input[id="name"]');
        await productNameInput.setValue('New Product');
        expect(wrapper.vm.product.name).toBe('New Product');
    });

    it('emits close event when close button is clicked', async () => {
        const closeButton = wrapper.find('.close-btn');
        await closeButton.trigger('click');
        expect(wrapper.emitted('close')).toBeTruthy();
    });

    it('adds a product when form is submitted', async () => {
        const addProductMock = jest.fn();
        wrapper.vm.addProduct = addProductMock;  // mock the addProduct method
        await wrapper.find('form').trigger('submit.prevent');
        expect(addProductMock).toHaveBeenCalled(); // check if the method was called
    });

    it('validates the form before submission', async () => {
        // Assuming there is validation logic and an errors object in the component
        const productNameInput = wrapper.find('input[id="name"]');
        await productNameInput.setValue(''); // Set an invalid value
        const form = wrapper.find('form');
        await form.trigger('submit.prevent');
        expect(wrapper.vm.errors).toBeDefined(); // Check if errors are present
    });
});