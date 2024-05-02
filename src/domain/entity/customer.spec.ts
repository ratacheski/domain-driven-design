import Address from "./address";
import Customer from "./customer";

describe("Customer unit tests", () => {

    it("should create a customer", () => {
        // Arrange
        const customer = new Customer('1', 'John Doe');
        // Assert
        expect(customer).toBeDefined();
    });

    it("should throw an error when creating a customer without an ID", () => {
        expect(() => new Customer('', 'John Doe')).toThrow('ID is required');
    });

    it("should throw an error when creating a customer without a Name", () => {
        expect(() => new Customer('123', '')).toThrow('Name is required');
    });

    it("should change the name of a customer", () => {
        // Arrange
        const customer = new Customer('1', 'John Doe');
        // Act
        customer.changeName('Jane Doe');
        // Assert
        expect(customer.name).toBe('Jane Doe');
    });	

    it("should activate a customer", () => {
        // Arrange
        const customer = new Customer('1', 'John Doe');
        const address = new Address('123 Main St', 'Springfield', 'IL', '62701', 'USA');
        customer.changeAddress(address);
        // Act
        customer.activate();
        // Assert
        expect(customer.isActive()).toBe(true);
    });

    it("should deactivate a customer", () => {
        // Arrange
        const customer = new Customer('1', 'John Doe');
        const address = new Address('123 Main St', 'Springfield', 'IL', '62701', 'USA');
        customer.changeAddress(address);
        customer.activate();
        // Act
        customer.deactivate();
        // Assert
        expect(customer.isActive()).toBe(false);
    });	

    it("should throw an error when activating a customer without an address", () => {
        // Arrange
        const customer = new Customer('1', 'John Doe');
        // Act & Assert
        expect(() => customer.activate()).toThrow('Address is required to activate a customer');
    });

    it("should increase reward points of a customer", () => {
        // Arrange
        const customer = new Customer('1', 'John Doe');
        // Act
        customer.increaseRewardPoints(100);
        // Assert
        expect(customer.rewardPoints).toBe(100);
    });
});