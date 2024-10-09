import { shallowMount } from '@vue/test-utils';
import PlaceProductForm from '@/components/PlaceProductForm.vue';
import flushPromises from 'flush-promises';

describe('PlaceProductForm.vue', () => {
    let wrapper;

    beforeEach(() => {
        global.fetch = jest.fn();
        window.alert = jest.fn();
        jest.clearAllMocks();  // Clear previous mocks

        wrapper = shallowMount(PlaceProductForm);
    });

    it('calls placeProduct and shows success message on successful API call', async () => {
        wrapper.setData({
            placement: {
                SKU: 'PROD001',
                slotCode: 'SLOT001',
            },
        });

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ message: 'Success' }),
        });

        await wrapper.find('form').trigger('submit.prevent');
        await flushPromises();

        expect(window.alert).toHaveBeenCalledWith('Product placed successfully with Slot Code: SLOT001');
        expect(wrapper.emitted().close).toBeTruthy();
    });

    it('shows an error message if the API call fails', async () => {
        wrapper.setData({
            placement: {
                SKU: 'PROD001',
                slotCode: 'SLOT001',
            },
        });

        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({ message: 'Error' }),
        });

        await wrapper.find('form').trigger('submit.prevent');
        await flushPromises();

        expect(window.alert).toHaveBeenCalledWith('Error placing product: Error');
    });

    it('handles network errors during product placement', async () => {
        wrapper.setData({
            placement: {
                SKU: 'PROD001',
                slotCode: 'SLOT001',
            },
        });

        global.fetch.mockRejectedValueOnce(new Error('Network Error'));

        await wrapper.find('form').trigger('submit.prevent');
        await flushPromises();

        expect(window.alert).toHaveBeenCalledWith('An error occurred while placing the product.');
    });
});