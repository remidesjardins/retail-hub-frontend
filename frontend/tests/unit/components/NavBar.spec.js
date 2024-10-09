import { shallowMount } from '@vue/test-utils';
import NavBar from '@/components/NavBar.vue';
import VueRouter from 'vue-router';

// No need to createLocalVue in Vue Test Utils v2 (for Vue 3)

describe('NavBar.vue', () => {
    let wrapper;
    let routerPushMock;

    beforeEach(() => {
        // Mock router push method
        routerPushMock = jest.fn();

        // Create wrapper
        wrapper = shallowMount(NavBar, {
            global: {
                mocks: {
                    $router: {
                        push: routerPushMock
                    }
                }
            }
        });
    });

    it('renders all menu items', () => {
        const menuItems = wrapper.findAll('.menu-item');
        expect(menuItems.length).toBe(4); // Ensure there are 4 menu items
    });

    it('calls notifyFunction when notification icon is clicked', () => {
        global.alert = jest.fn(); // Mock the global alert function
        const notifyItem = wrapper.findAll('.menu-item').at(0);
        notifyItem.trigger('click');
        expect(global.alert).toHaveBeenCalledWith('Notification center clicked!');
    });

    it('calls cartFunction and navigates to Sale page when cart icon is clicked', () => {
        const cartItem = wrapper.findAll('.menu-item').at(1);
        cartItem.trigger('click');
        expect(routerPushMock).toHaveBeenCalledWith({ name: 'Sale' });
    });

    it('calls inboxFunction and navigates to ClientSearch page when inbox icon is clicked', () => {
        const inboxItem = wrapper.findAll('.menu-item').at(2);
        inboxItem.trigger('click');
        expect(routerPushMock).toHaveBeenCalledWith({ name: 'ClientSearch' });
    });

    it('calls profileFunction and navigates to the employee profile page when user icon is clicked', () => {
        const profileItem = wrapper.findAll('.menu-item').at(3);
        profileItem.trigger('click');
        expect(routerPushMock).toHaveBeenCalledWith('/employee/66fdffb56790cc1514a6a267');
    });
});