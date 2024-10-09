import { shallowMount } from '@vue/test-utils';
import InvoiceList from '@/components/InvoiceList.vue';

const mockSales = [
    {
        _id: '66ff5533f11d65f54ea3f167',
        customer: {
            name: 'Alexandre Borny',
            email: 'alexandre.borny@efrei.net',
            phone: '+33767522707',
            address: '777 boulevard Robert-Bourassa, Montréal, QC, H3C 3Z7, Canada'
        },
        products: [
            {
                SKU: 'PROD001',
                quantity: 1,
                price_per_unit: 1299.99,
                _id: '66ff5533f11d65f54ea3f168'
            },
            {
                SKU: 'PROD003',
                quantity: 2,
                price_per_unit: 799.99,
                _id: '66ff5533f11d65f54ea3f169'
            }
        ],
        total_price: 3334.97,
        payment_status: 'Completed',
        payment_method: 'PayPal',
        reference: 'REF001',
        is_invoiced: false,
        sale_date: '2024-10-04T02:38:43.461Z'
    },
    {
        _id: '66ff5533f11d65f54ea3f170',
        customer: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1234567890',
            address: '456 Another St, New York, NY, 10001, USA'
        },
        products: [
            {
                SKU: 'PROD002',
                quantity: 1,
                price_per_unit: 199.99,
                _id: '66ff5533f11d65f54ea3f171'
            }
        ],
        total_price: 199.99,
        payment_status: 'Pending',
        payment_method: 'Credit Card',
        reference: 'REF002',
        is_invoiced: true,
        sale_date: '2024-10-03T12:24:16.461Z'
    }
];

// Mock global window.confirm and alert
global.confirm = jest.fn(() => true);
global.alert = jest.fn();

describe('InvoiceList.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(InvoiceList, {
            propsData: { sales: mockSales },
        });
        global.fetch = jest.fn(); // Mock fetch for each test
    });

    it('renders the sales list', () => {
        expect(wrapper.findAll('.invoice-card').length).toBe(2);
    });

    it('opens the update overlay when updateSale method is called', async () => {
        wrapper.vm.updateSale(mockSales[0]);
        expect(wrapper.vm.selectedSale).toStrictEqual(mockSales[0]);
        expect(wrapper.vm.showUpdateOverlay).toBe(true);
    });

    it('closes the update overlay when closeUpdateOverlay is called', async () => {
        wrapper.vm.closeUpdateOverlay();
        expect(wrapper.vm.showUpdateOverlay).toBe(false);
    });

    it('deletes a sale when deleteSale is called', async () => {
        global.fetch.mockResolvedValue({ ok: true }); // Mock successful DELETE response

        await wrapper.vm.deleteSale('66ff5533f11d65f54ea3f167');
        expect(global.fetch).toHaveBeenCalledTimes(1); // Ensure fetch is called
        expect(wrapper.props('sales').length).toBe(2); // Ensure sales prop remains unaffected
    });

    it('handles fetchProduct correctly during invoice generation', async () => {
        global.fetch.mockImplementation((url) => {
            if (url.includes('products')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ name: 'Test Product', Details: 'Product Details' }),
                });
            }
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ access_token: 'token' }),
            });
        });

        await wrapper.vm.generateInvoice(mockSales[0]);
        expect(global.fetch).toHaveBeenCalledTimes(2); // 1 for access token, 1 for product fetch
    });

    it('generates an invoice when generateInvoice is called', async () => {
        global.fetch = jest.fn((url) => {
            if (url === 'https://api-m.sandbox.paypal.com/v1/oauth2/token') {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ access_token: 'token' }),
                });
            }
            if (url === 'https://api-m.sandbox.paypal.com/v2/invoicing/invoices') {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ href: 'invoice-link' }),
                });
            }
            return Promise.resolve({});
        });

        await wrapper.vm.generateInvoice(mockSales[0]);
        expect(global.fetch).toHaveBeenCalledTimes(2);
    });
});