import { mount } from '@vue/test-utils';
import ProductList from '@/components/ProductList.vue';

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve([
            { name: 'Product 1', SKU: 'PROD001', price: 100, Image: 'http://example.com/prod1.jpg' },
            { name: 'Product 2', SKU: 'PROD002', price: 200, Image: 'http://example.com/prod2.jpg' }
        ]),
    })
);

beforeAll(() => {
    global.alert = jest.fn(); // Mock alert globally
});

describe('ProductList.vue', () => {
    let wrapper;

    const productList = [
        { name: 'Product 1', SKU: 'PROD001', price: 100, Image: 'http://example.com/prod1.jpg' },
        { name: 'Product 2', SKU: 'PROD002', price: 200, Image: 'http://example.com/prod2.jpg' },
    ];

    beforeEach(() => {
        wrapper = mount(ProductList, {
            props: {
                productList,
                text: 'Product List',
            },
        });
    });

    it('renders the correct number of products', () => {
        const productItems = wrapper.findAll('.product');
        expect(productItems.length).toBe(productList.length);
    });

    it('displays the correct text passed as a prop', () => {
        expect(wrapper.find('h2').text()).toBe('Product List');
    });

    it('emits the "productSelected" event when a product is clicked', async () => {
        const product = wrapper.find('.product');
        await product.trigger('click');
        expect(wrapper.emitted('productSelected')).toBeTruthy();
        expect(wrapper.emitted('productSelected')[0][0]).toEqual(productList[0]);
    });

    it('fetches the product image if not provided', () => {
        const placeholderImage = wrapper.vm.getProductImage('PROD999');
        expect(placeholderImage).toBe('https://via.placeholder.com/100');
    });

    it('shows "Nothing here yet" when the product list is empty', async () => {
        await wrapper.setProps({ productList: [] });
        expect(wrapper.find('#empty-title').text()).toContain('Nothing here yet');
    });

    it('updates the productList when "updateProducts" is called', async () => {
        const newProducts = [
            { name: 'Product 3', SKU: 'PROD003', price: 300 },
            { name: 'Product 4', SKU: 'PROD004', price: 400 }
        ];
        await wrapper.vm.updateProducts(newProducts);
        expect(wrapper.vm.internalIsEmpty).toBe(false);
    });

    it('fetches and updates products on mount', async () => {
        const fetchSpy = jest.spyOn(ProductList.methods, 'fetchProducts');
        wrapper = mount(ProductList, {
            props: {
                productList: [],
                text: 'Product List',
            },
        });
        expect(fetchSpy).toHaveBeenCalled();
    });

    it('handles mouse down, move, and up events', async () => {
        const productSlider = wrapper.find({ ref: 'productSlider' });
        productSlider.trigger('mousedown', { pageX: 100 });
        expect(wrapper.vm.startX).toBe(100);

        productSlider.trigger('mousemove', { pageX: 150 });
        expect(wrapper.vm.isDragging).toBeUndefined(); // It's false by default

        productSlider.trigger('mouseup');
        expect(wrapper.vm.isDragging).toBe(false);
    });
});