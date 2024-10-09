import { mount } from '@vue/test-utils';
import ReceiptParcelForm from '@/components/ReceiptParcelForm.vue';

global.fetch = jest.fn();
global.alert = jest.fn();

describe('ReceiptParcelForm.vue', () => {
    let wrapper;

    const mockProduct = { Current_stock: 50 };
    const mockNetworkError = new Error('Network error');

    beforeEach(() => {
        wrapper = mount(ReceiptParcelForm);
        fetch.mockClear();
        alert.mockClear();
    });

    it('makes an API call when form is submitted with valid data', async () => {
        // First fetch (GET) mock: Get product details with current stock
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockProduct // Mocking the initial stock
        });

        // Second fetch (PUT) mock: Update stock success
        fetch.mockResolvedValueOnce({
            ok: true
        });

        // Set the form inputs
        await wrapper.find('#sku').setValue('PROD001');
        await wrapper.find('#received-amount').setValue(10);

        // Trigger form submit
        await wrapper.find('form').trigger('submit.prevent');

        // First fetch (GET request to fetch product details)
        expect(fetch).toHaveBeenCalledWith('https://com.servhub.fr/api/products/PROD001');

        // Second fetch (PUT request to update stock)
        expect(fetch).toHaveBeenCalledWith(
            'https://com.servhub.fr/api/products/PROD001',
            expect.objectContaining({
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Current_stock: 60 })
            })
        );

        // Expect an alert showing the updated stock level
        expect(alert).toHaveBeenCalledWith('Stock updated successfully. New stock level: 60');
    });

    it('shows an alert if product is not found', async () => {
        // Mock the GET request response with a null product
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => null // Product not found
        });

        // Set the form inputs
        await wrapper.find('#sku').setValue('PROD001');
        await wrapper.find('#received-amount').setValue(10);

        // Trigger form submit
        await wrapper.find('form').trigger('submit.prevent');

        // Expect an alert for product not found
        expect(alert).toHaveBeenCalledWith('Failed to update stock level.');
    });

    it('shows an alert if stock update fails', async () => {
        // First fetch (GET): Mock the initial product fetch
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockProduct
        });

        // Second fetch (PUT): Mock failure when updating the stock
        fetch.mockResolvedValueOnce({
            ok: false // Failure response
        });

        // Set the form inputs
        await wrapper.find('#sku').setValue('PROD001');
        await wrapper.find('#received-amount').setValue(10);

        // Trigger form submit
        await wrapper.find('form').trigger('submit.prevent');

        // Expect an alert showing the failure message
        expect(alert).toHaveBeenCalledWith('Failed to update stock level.');
    });

    it('shows an alert if there is an error in the API call', async () => {
        // Mock a network error in the API call
        fetch.mockRejectedValueOnce(mockNetworkError);

        // Set the form inputs
        await wrapper.find('#sku').setValue('PROD001');
        await wrapper.find('#received-amount').setValue(10);

        // Trigger form submit
        await wrapper.find('form').trigger('submit.prevent');

        // Expect an alert showing the error message
        expect(alert).toHaveBeenCalledWith('Failed to update stock level.');
    });

    it('resets form and closes after successful submission', async () => {
        // First fetch (GET) mock: Get product details with current stock
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockProduct // Mocking the initial stock
        });

        // Second fetch (PUT) mock: Update stock success
        fetch.mockResolvedValueOnce({
            ok: true
        });

        // Set the form inputs
        await wrapper.find('#sku').setValue('PROD001');
        await wrapper.find('#received-amount').setValue(10);

        // Trigger form submit
        await wrapper.find('form').trigger('submit.prevent');

        // Expect the form fields to be reset
        expect(wrapper.find('#sku').element.value).toBe('');
        expect(wrapper.find('#received-amount').element.value).toBe('');

        // Expect the form to emit close event
        expect(wrapper.emitted().close).toBeTruthy();
    });
});