import { mount } from '@vue/test-utils';
import ChartComp from '@/components/ChartComp.vue';
import flushPromises from 'flush-promises';

// Mock the chart.js and window alert
jest.mock('chart.js/auto', () => ({
    Chart: jest.fn(() => ({
        destroy: jest.fn(),
        update: jest.fn(),
    })),
}));

global.alert = jest.fn(); // Mock window.alert

describe('ChartComp.vue', () => {
    let wrapper;

    beforeEach(() => {
        // Mock the fetch API
        global.fetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve([{
                _id: { week: 1 },
                sales: [
                    { total_price: 100, sale_date: '2024-01-03' } // Ensure this date falls on a Friday
                ]
            }]),
        }));

        wrapper = mount(ChartComp, {
            propsData: {
                years: false,
                months: false,
                weeks: true, // Testing weeks
            },
        });
    });

    afterEach(() => {
        global.fetch.mockClear(); // Clear the mock after each test
    });

    it('renders correctly', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('fetches data for weeks', async () => {
        await flushPromises(); // Wait for promises to resolve

        // Check if the chart labels are correct
        expect(wrapper.vm.chartLabel).toEqual(['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']);
        // Check if the chart data is populated
        expect(wrapper.vm.chartData).toEqual([0, 0, 0, 0, 100, 0, 0]); // Mocked data for weeks
    });

});