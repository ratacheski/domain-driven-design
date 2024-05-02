import SendEmailWhenProductIsCreatedHandler from "../product/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../product/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe('Domain events test', () => {

    it('should register an event handler', () => {
        // Arrange
        const  eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        // Act
        eventDispatcher.register('ProductCreatedEvent', eventHandler);

        // Assert
        expect(eventDispatcher.getEventHandlers('ProductCreatedEvent')).toBeDefined();
        expect(eventDispatcher.getEventHandlers('ProductCreatedEvent').size).toBe(1);
        expect(eventDispatcher.getEventHandlers('ProductCreatedEvent')).toContain(eventHandler);
    });

    it('should unregister an event handler', () => {
        // Arrange
        const  eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        eventDispatcher.register('ProductCreatedEvent', eventHandler);

        // Act
        eventDispatcher.unregister('ProductCreatedEvent', eventHandler);

        // Assert
        expect(eventDispatcher.getEventHandlers('ProductCreatedEvent')).toBeDefined();
        expect(eventDispatcher.getEventHandlers('ProductCreatedEvent')).not.toContain(eventHandler);
        expect(eventDispatcher.getEventHandlers('ProductCreatedEvent').size).toBe(0);
    }); 

    it('should unregister all event handlers', () => {
        // Arrange
        const  eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        eventDispatcher.register('ProductCreatedEvent', eventHandler);

        // Act
        eventDispatcher.unregisterAll('ProductCreatedEvent');

        // Assert
        expect(eventDispatcher.getEventHandlers('ProductCreatedEvent')).toBeUndefined();
    });

    it('should notify all event handlers', () => {
        // Arrange
        const  eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        eventDispatcher.register('ProductCreatedEvent', eventHandler);
        const spyEventHandler = jest.spyOn(eventHandler, 'handle');

        const event = new ProductCreatedEvent({name: 'Product 1', price: 100});

        // Act
        eventDispatcher.notify(event);

        // Assert
        expect(eventDispatcher.getEventHandlers('ProductCreatedEvent')).toBeDefined();
        expect(eventDispatcher.getEventHandlers('ProductCreatedEvent').size).toBe(1);
        expect(eventDispatcher.getEventHandlers('ProductCreatedEvent')).toContain(eventHandler);
        expect(spyEventHandler).toHaveBeenCalledTimes(1);
    });
});