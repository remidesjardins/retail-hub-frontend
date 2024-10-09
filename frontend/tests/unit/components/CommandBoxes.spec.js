import { shallowMount } from '@vue/test-utils';
import CommandComponent from '@/components/CommandBoxes.vue'; // Assuming the component is named CommandComponent
import AddProductForm from '@/components/AddProductForm.vue';
import StockCorrectionForm from '@/components/StockCorrection.vue';
import ReceiptParcelForm from '@/components/ReceiptParcelForm.vue';
import PlaceProductForm from '@/components/PlaceProductForm.vue';

describe('CommandComponent.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(CommandComponent);
    });

    afterEach(() => {
        wrapper.unmount(); // Use unmount instead of destroy
    });

    it('renders the command buttons correctly', () => {
        const commandButtons = wrapper.findAll('.command-box');
        expect(commandButtons.length).toBe(4); // Check that 4 buttons exist
        expect(commandButtons.at(0).text()).toBe('Receipt of a parcel');
        expect(commandButtons.at(1).text()).toBe('Place a product');
        expect(commandButtons.at(2).text()).toBe('Stock correction');
        expect(commandButtons.at(3).text()).toBe('Add Product');
    });

    it('shows AddProductForm when "Add Product" is clicked', async () => {
        const addProductButton = wrapper.find('.command-box:nth-child(4)');
        await addProductButton.trigger('click');

        expect(wrapper.vm.showAddProductForm).toBe(true);
        expect(wrapper.findComponent(AddProductForm).exists()).toBe(true);
    });

    it('shows StockCorrectionForm when "Stock correction" is clicked', async () => {
        const stockCorrectionButton = wrapper.find('.command-box:nth-child(3)');
        await stockCorrectionButton.trigger('click');

        expect(wrapper.vm.showStockCorrectionForm).toBe(true);
        expect(wrapper.findComponent(StockCorrectionForm).exists()).toBe(true);
    });

    it('shows ReceiptParcelForm when "Receipt of a parcel" is clicked', async () => {
        const receiptButton = wrapper.find('.command-box:nth-child(1)');
        await receiptButton.trigger('click');

        expect(wrapper.vm.showReceiptForm).toBe(true);
        expect(wrapper.findComponent(ReceiptParcelForm).exists()).toBe(true);
    });

    it('shows PlaceProductForm when "Place a product" is clicked', async () => {
        const placeProductButton = wrapper.find('.command-box:nth-child(2)');
        await placeProductButton.trigger('click');

        expect(wrapper.vm.showPlaceProductForm).toBe(true);
        expect(wrapper.findComponent(PlaceProductForm).exists()).toBe(true);
    });

    it('closes forms when "closeForm" is called', async () => {
        // Simulate opening the forms
        wrapper.vm.showAddProductForm = true;
        wrapper.vm.showStockCorrectionForm = true;

        // Call the closeForm method
        await wrapper.vm.closeForm();

        // Check that the forms are closed
        expect(wrapper.vm.showAddProductForm).toBe(false);
        expect(wrapper.vm.showStockCorrectionForm).toBe(false);
    });
});