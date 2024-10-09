import { mount } from '@vue/test-utils';
import ProductDetails from '@/components/ProductDetails.vue';
import ModifyProductForm from '@/components/ModifyProductForm.vue';

describe('ProductDetails.vue', () => {
    let wrapper;

    const mockProduct = {
        name: 'Test Product',
        category: 'Electronics',
        SKU: '12345',
        Image: 'https://via.placeholder.com/150',
        Current_stock: 10,
        Slot: 'A1',
        price: 99.99,
        Details: 'This is a test product.'
    };

    //Mocks des méthodes
    const addToCartMock = jest.fn();
    const deleteProductMock = jest.fn();

    beforeEach(() => {
        wrapper = mount(ProductDetails, {
            props: {
                product: mockProduct
            },
            global: {
                mocks: {
                    $store: {
                        state: {
                            bagContents: []
                        },
                        commit: jest.fn(),
                        dispatch: jest.fn(),
                    },
                    $router: {
                        push: jest.fn()
                    }
                }
            },
            methods: {
                addToCart: addToCartMock, // Mock la methode
                deleteProduct(productSKU) {
                    if (confirm("Are you sure you want to delete this product?")) {
                        fetch(`https://com.servhub.fr/api/products/${productSKU}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                            .then(response => {
                                if (response.ok) {
                                    this.$emit('productDeleted', productSKU);
                                } else {
                                    alert('Failed to delete the product.');
                                }
                            })
                            .catch(error => {
                                console.error('Error deleting product:', error);
                                alert('An error occurred while deleting the product.');
                            });
                    }
                }
            }
        });

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({message: 'Product deleted'}),
            })
        );
    });

    // Nettoyage après chaque test
    afterEach(() => {
        // Détruire le wrapper pour éviter des fuites de mémoire ou garder l'état entre les tests
        wrapper.unmount();
    });

    it('renders product name correctly', () => {
        const productName = wrapper.find('.product-title').text();
        expect(productName).toBe(mockProduct.name);
    });

    it('calls addToCart when Add to cart button is clicked', async () => {
        wrapper.vm.addToCart = addToCartMock;
        await wrapper.find('.add-to-cart').trigger('click');
        expect(addToCartMock).toHaveBeenCalled();
    });

    it('opens ModifyProductForm when edit button is clicked', async () => {
        const modifyButton = wrapper.find('.fa-pen-to-square');
        await modifyButton.trigger('click');
        expect(wrapper.findComponent(ModifyProductForm).exists()).toBe(true);
    });

    it('deletes product when delete button is clicked', async () => {
        window.confirm = jest.fn(() => true); // Simule l'acceptation de la confirmation
        const deleteButton = wrapper.find('.fa-trash');
        await deleteButton.trigger('click');

        expect(global.fetch).toHaveBeenCalledWith(
            `https://com.servhub.fr/api/products/${mockProduct.SKU}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    });
});