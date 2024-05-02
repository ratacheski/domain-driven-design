import OrderItem from "./order_item";

describe("OrderItem unit tests", () => {
    it("should throw an error when creating an order item without an ID", () => {
        expect(() => new OrderItem('', '1', 'Product 1', 10, 2)).toThrow('ID is required');
    });

    it("should throw an error when creating an order item without a product ID", () => {
        expect(() => new OrderItem('1', '', 'Product 1', 10, 2)).toThrow('Product ID is required');
    });

    it("should throw an error when creating an order item without a name", () => {
        expect(() => new OrderItem('1', '1', '', 10, 2)).toThrow('Name is required');
    });

    it("should throw an error when creating an order item with a price less than or equal to 0", () => {
        expect(() => new OrderItem('1', '1', 'Product 1', 0, 2)).toThrow('Price must be greater than 0');
    });

    it("should throw an error when creating an order item with a quantity less than or equal to 0", () => {
        expect(() => new OrderItem('1', '1', 'Product 1', 10, 0)).toThrow('Quantity must be greater than 0');
    });

    it("should create an order item", () => {
        expect(new OrderItem('1', '1', 'Product 1', 10, 2)).toBeDefined();
    });
});