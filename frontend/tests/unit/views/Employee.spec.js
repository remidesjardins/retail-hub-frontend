import { shallowMount } from '@vue/test-utils';
import EmployeeView from '@/views/EmployeeView.vue';

// Mock Vue Router
const mockRouter = {
    push: jest.fn()
};

// Mock the fetch API globally
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve([
            {
                _id: 'sale1',
                total_price: 500,
                soldBy: '66fdffb56790cc1514a6a267', // Matches the employee ID
                sale_date: new Date().toISOString(), // Current date
                payment_status: 'Completed'
            },
            {
                _id: 'sale2',
                total_price: 300,
                soldBy: 'wrongEmployeeId', // Doesn't match the employee ID
                sale_date: new Date().toISOString(),
                payment_status: 'Completed'
            },
            {
                _id: 'sale3',
                total_price: 200,
                soldBy: '66fdffb56790cc1514a6a267', // Matches the employee ID
                sale_date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(), // Previous month
                payment_status: 'Completed'
            }
        ])
    })
);

describe('EmployeeView.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(EmployeeView, {
            global: {
                mocks: {
                    $router: mockRouter // Mock router
                }
            },
            data() {
                return {
                    employeeId: '66fdffb56790cc1514a6a267',
                    totalSold: 0,
                    totalBonus: 0,
                    currentMonth: new Date().getMonth()
                };
            }
        });
    });

    afterEach(() => {
        wrapper.unmount(); // Clean up after each test
    });

    it('renders correctly', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('fetches and calculates sales data on mount', async () => {
        // Call fetchSalesData directly
        await wrapper.vm.fetchSalesData();

        // Ensure that totalSold and totalBonus are calculated correctly
        expect(wrapper.vm.totalSold).toBe('500.00'); // Only one sale from the current month and matching employee
        expect(wrapper.vm.totalBonus).toBe('5.00');  // 1% of the total sold
    });

    it('formats the current month in letters', () => {
        const currentMonth = new Date().getMonth();
        const monthName = wrapper.vm.monthInLetter(currentMonth);

        expect(monthName).toBe(new Date().toLocaleString('en-EN', { month: 'long' }));
    });

    it('redirects to the Admin view when the "Access stats" button is clicked', async () => {
        const statsButton = wrapper.find('.stats-button');
        await statsButton.trigger('click');

        expect(mockRouter.push).toHaveBeenCalledWith({ name: 'Admin' });
    });

    it('logs out when the "Log out" button is clicked', () => {
        const logoutButton = wrapper.find('.logout-button');
        const consoleSpy = jest.spyOn(console, 'log');

        logoutButton.trigger('click');
        expect(consoleSpy).toHaveBeenCalledWith('Logging out');
    });
});