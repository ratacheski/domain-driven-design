import Address from "../value-object/address";
import Customer from "../../customer/entity/customer";
import CustomerAddressChangedEvent from "./customer-address-changed.event";
import CustomerCreatedEvent from "./customer-created.event";
import EnviaConsoleLogHandler from "./handler/envia-console-log-handler.handler";
import EnviaConsoleLog1Handler from "./handler/envia-console-log1-handler.handler";
import EnviaConsoleLog2Handler from "./handler/envia-console-log2-handler.handler";
import EventDispatcher from "../../@shared/event/event-dispatcher";

describe("Customer events test", () => {
  it("should notify customer address changed", () => {
    // Arrange
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EnviaConsoleLogHandler();
    eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

    const customer = new Customer("1", "John Doe");
    const address = new Address(
      "123 Main St",
      "Springfield",
      "IL",
      "62701",
      "USA"
    );
    customer.changeAddress(address);

    const event = new CustomerAddressChangedEvent({
      customerId: customer.id,
      customerName: customer.name,
      address,
    });

    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    // Act
    eventDispatcher.notify(event);

    // Assert
    expect(
      eventDispatcher.getEventHandlers("CustomerAddressChangedEvent")
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers("CustomerAddressChangedEvent").size
    ).toBe(1);
    expect(spyEventHandler).toHaveBeenCalledTimes(1);
  });

  it("should notify customer created to all handlers", () => {
    // Arrange
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new EnviaConsoleLog1Handler();
    const eventHandler2 = new EnviaConsoleLog2Handler();
    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
    const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

    const customer = new Customer("1", "John Doe");
    const event = new CustomerCreatedEvent(customer);

    // Act
    eventDispatcher.notify(event);

    // Assert
    expect(
      eventDispatcher.getEventHandlers("CustomerCreatedEvent")
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers("CustomerCreatedEvent").size).toBe(
      2
    );
    expect(spyEventHandler1).toHaveBeenCalledTimes(1);
    expect(spyEventHandler2).toHaveBeenCalledTimes(1);
  });
});
