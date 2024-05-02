import Order from "./order";
import OrderItem from "./order_item";

describe("Order unit tests", () => {
    
        it("should throw an error when creating an order without an ID", () => {
            expect(() => new Order('', '1', [])).toThrow('ID is required');
        });
    
        it("should throw an error when creating an order without a customer ID", () => {
            expect(() => new Order('1', '', [])).toThrow('Customer ID is required');
        });
    
        it("should throw an error when creating an order without items", () => {
            expect(() => new Order('1', '1', [])).toThrow('Items are required');
        });

        it("should create an order", () => {
            // Arrange
            const item1 = new OrderItem('1', '1', 'Product 1', 10, 2);
            const item2 = new OrderItem('2', '2', 'Product 2', 20, 3);
            // Act
            const order = new Order('1', '1', [item1, item2]);
            // Assert
            expect(order).toBeDefined();
        });
    
    
        it("should calculate the total of an order", () => {
            // Arrange
            const item1 = new OrderItem('1', '1', 'Product 1', 10, 2);
            const item2 = new OrderItem('2', '2', 'Product 2', 20, 3);
            // Act
            const order = new Order('1', '1', [item1, item2]);
            const total = order.total();
            // Assert
            expect(total).toBe(80);
        });
});	