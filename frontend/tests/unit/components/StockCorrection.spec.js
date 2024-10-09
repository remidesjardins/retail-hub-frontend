import { mount } from "@vue/test-utils";
import StockCorrection from "@/components/StockCorrection.vue";

// Mock global fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ Current_stock: 100 }),
  })
);

describe("StockCorrection.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(StockCorrection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find("h2").text()).toBe("Stock Correction");
  });

  it("displays an alert if SKU or adjustment is missing", async () => {
    window.alert = jest.fn();

    // Simule la soumission sans saisir les valeurs
    await wrapper.find("form").trigger("submit.prevent");
    expect(window.alert).toHaveBeenCalledWith(
      "Please fill in both SKU Code and Stock Adjustment."
    );
  });

  it("makes a correct API call on form submission", async () => {
    // Simule la saisie du SKU et du stock
    await wrapper.find("#sku").setValue("SKU123");
    await wrapper.find("#adjustment").setValue(10);

    // Simule la soumission du formulaire
    await wrapper.find("form").trigger("submit.prevent");

    // Vérifie que le fetch pour récupérer le produit est bien appelé
    expect(global.fetch).toHaveBeenCalledWith(
      "https://com.servhub.fr/api/products/SKU123"
    );

    // Simule la réponse avec les détails du produit
    expect(global.fetch).toHaveBeenCalledTimes(2); // Un fetch pour récupérer, un pour mettre à jour
    expect(global.fetch).toHaveBeenCalledWith(
      "https://com.servhub.fr/api/products/SKU123",
      expect.objectContaining({
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ SKU: "SKU123", Current_stock: 110 }),
      })
    );
  });

  it("displays an alert on API fetch failure", async () => {
    window.alert = jest.fn();

    // Modifie le mock de fetch pour simuler un échec
    global.fetch.mockImplementationOnce(() => Promise.resolve({ ok: false }));

    // Simule la saisie du SKU et de l'ajustement
    await wrapper.find("#sku").setValue("SKU123");
    await wrapper.find("#adjustment").setValue(10);

    // Simule la soumission du formulaire
    await wrapper.find("form").trigger("submit.prevent");

    // Vérifie que l'alerte d'échec de récupération du produit est affichée
    expect(window.alert).toHaveBeenCalledWith(
      "Error fetching product with SKU: SKU123"
    );
  });

  it("emits close event on successful stock correction", async () => {
    // Simule la saisie du SKU et de l'ajustement
    await wrapper.find("#sku").setValue("SKU123");
    await wrapper.find("#adjustment").setValue(10);

    // Simule la soumission du formulaire
    await wrapper.find("form").trigger("submit.prevent");

    //Attends la mise à jour du DOM et l'émission de l'événement
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().close).toBeTruthy();
  });
});
