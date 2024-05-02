import Product from "./product";

describe("Product unit tests", () => {
    it("should throw an error when creating a product without an ID", () => {
        expect(() => new Product('', '1', 10)).toThrow('ID is required');
    });

    it("should throw an error when creating a product without a name", () => {
        expect(() => new Product('1', '', 10)).toThrow('Name is required');
    });

    it("should throw an error when creating a product without a price", () => {
        expect(() => new Product('1', '1', 0)).toThrow('Price must be greater than 0');
    });

    it("should create a product", () => {
        // Arrange
        // Act
        const product = new Product('1', '1', 10);
        // Assert
        expect(product).toBeDefined();
    });

    it("should calculate the total of a product", () => {
        // Arrange
        // Act
        const product = new Product('1', '1', 10);
        const total = product.total();
        // Assert
        expect(total).toBe(10);
    });

    it("should change the name of a product", () => {
        // Arrange
        const product = new Product('1', 'Product 1', 10);
        // Act
        product.changeName('Product 2');
        // Assert
        expect(product.name).toBe('Product 2');
    });

    it("should throw an error when changing the name of a product to an empty string", () => {
        // Arrange
        const product = new Product('1', 'Product 1', 10);
        // Act
        // Assert
        expect(() => product.changeName('')).toThrow('Name is required');
    });

    it("should change the price of a product", () => {
        // Arrange
        const product = new Product('1', 'Product 1', 10);
        // Act
        product.changePrice(20);
        const total = product.total();
        // Assert
        expect(total).toBe(20);
    });
});