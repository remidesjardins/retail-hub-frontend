import { shallowMount } from '@vue/test-utils';
import AdminView from '@/views/AdminView.vue';
import NavBar from '@/components/NavBar.vue';
import ChartComp from '@/components/ChartComp.vue';

describe('AdminView.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(AdminView, {
            stubs: {
                NavBar: true,
                ChartComp: true,
            },
            mocks: {
                $router: {
                    go: jest.fn(),
                },
            },
        });
    });

    afterEach(() => {
        wrapper.unmount(); // Use unmount instead of destroy()
    });

    it('renders NavBar and ChartComp components', () => {
        expect(wrapper.findComponent(NavBar).exists()).toBe(true);
        expect(wrapper.findComponent(ChartComp).exists()).toBe(true);
    });

    it('has "week" as the default period and shows week chart', () => {
        expect(wrapper.vm.period).toBe('week');
        expect(wrapper.vm.weeks).toBe(true);
        expect(wrapper.vm.months).toBe(false);
        expect(wrapper.vm.years).toBe(false);
    });

    it('changes the period to "month" and updates ChartComp visibility', async () => {
        wrapper.vm.changePeriod('month');
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.period).toBe('month');
        expect(wrapper.vm.weeks).toBe(false);
        expect(wrapper.vm.months).toBe(true);
        expect(wrapper.vm.years).toBe(false);
    });

    it('changes the period to "year" and updates ChartComp visibility', async () => {
        wrapper.vm.changePeriod('year');
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.period).toBe('year');
        expect(wrapper.vm.weeks).toBe(false);
        expect(wrapper.vm.months).toBe(false);
        expect(wrapper.vm.years).toBe(true);
    });

    it('applies active class to the correct period button', async () => {
        const buttons = wrapper.findAll('button');

        // Week is the default period, so the first button should be active
        expect(buttons[0].classes()).toContain('active');
        expect(buttons[1].classes()).not.toContain('active');
        expect(buttons[2].classes()).not.toContain('active');

        // Simulate clicking "Month"
        await buttons[1].trigger('click');
        expect(wrapper.vm.period).toBe('month');
        expect(buttons[1].classes()).toContain('active');
        expect(buttons[0].classes()).not.toContain('active');
        expect(buttons[2].classes()).not.toContain('active');

        // Simulate clicking "Year"
        await buttons[2].trigger('click');
        expect(wrapper.vm.period).toBe('year');
        expect(buttons[2].classes()).toContain('active');
        expect(buttons[0].classes()).not.toContain('active');
        expect(buttons[1].classes()).not.toContain('active');
    });
});