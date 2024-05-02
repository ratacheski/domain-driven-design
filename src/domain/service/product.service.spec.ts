import Product from "../entity/product";
import ProductService from "./product.service";

describe("Product Service Unit Test", () => {
  it("should change the price of all supplied products", () => {
    // Arrange
    const product1 = new Product("1", "Product 1", 100);
    const product2 = new Product("2", "Product 2", 200);
    const product3 = new Product("3", "Product 3", 300);
    const products = [product1, product2, product3];

    // Act
    ProductService.increasePrice(products, 100);

    // Assert
    expect(product1.total()).toBe(200);
    expect(products[1].total()).toBe(400);
    expect(products[2].total()).toBe(600);
  });
});
