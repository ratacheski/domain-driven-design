import Address from "./address";

describe("Address unit tests", () => {
    it("should create an address", () => {
        // Act
        const address = new Address('123 Main St', 'Springfield', 'IL', '62701', 'USA');
        // Assert
        expect(address).toBeDefined();
    });

    it("should throw an error when creating an address without a street", () => {
        expect(() => new Address('', 'Springfield', 'IL', '62701', 'USA')).toThrow('Street is required');
    });

    it("should throw an error when creating an address without a city", () => {
        expect(() => new Address('123 Main St', '', 'IL', '62701', 'USA')).toThrow('City is required');
    });

    it("should throw an error when creating an address without a state", () => {
        expect(() => new Address('123 Main St', 'Springfield', '', '62701', 'USA')).toThrow('State is required');
    });

    it("should throw an error when creating an address without a zip", () => {
        expect(() => new Address('123 Main St', 'Springfield', 'IL', '', 'USA')).toThrow('Zip is required');
    });

    it("should throw an error when creating an address without a country", () => {
        expect(() => new Address('123 Main St', 'Springfield', 'IL', '62701', '')).toThrow('Country is required');
    });

    it("should return a string representation of an address", () => {
        // Arrange
        const address = new Address('123 Main St', 'Springfield', 'IL', '62701', 'USA');
        // Act
        const result = address.toString();
        // Assert
        expect(result).toBe('123 Main St, Springfield, IL, 62701, USA');
    });
});