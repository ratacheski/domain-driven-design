import ProductFactory from "./product.factory";

describe("Product Factory unit test", () => {
  it("should create a product", () => {
    const product = ProductFactory.create("Product A", 10);

    expect(product.id).toBeDefined();
    expect(product.name).toBe("Product A");
    expect(product.price).toBe(10);
    expect(product.constructor.name).toBe("Product");
  });
});
