import Address from "../../customer/value-object/address";
import Customer from "../../customer/entity/customer";
import Order from "../entity/order";
import OrderItem from "../entity/order_item";
import OrderService from "./order.service";

describe("Order Service Unit Tests", () => {
  it("should get total of all orders", () => {
    // Arrange
    const item1 = new OrderItem("1", "1", "Product 1", 100, 2);
    const item2 = new OrderItem("2", "2", "Product 2", 200, 3);
    const order1 = new Order("1", "1", [item1]);
    const order2 = new Order("2", "2", [item2]);
    const orders = [order1, order2];
    // Act\
    const total = OrderService.getTotal(orders);
    // Assert
    expect(total).toBe(800);
  });

  it("should place an order", () => {
    // Arrange
    const customer = new Customer("1", "John Doe");
    const address = new Address('123 Main St', 'Springfield', 'IL', '62701', 'USA');
    customer.changeAddress(address);
    customer.activate();
    const item1 = new OrderItem("1", "1", "Product 1", 100, 2);
    const item2 = new OrderItem("2", "2", "Product 2", 200, 3);
    const items = [item1, item2];
    // Act
    const order = OrderService.placeOrder(customer, items);

    // Assert
    expect(order.total()).toBe(800);
    expect(customer.rewardPoints).toBe(400);
  });
});
