import EventDispatcherInterface from "./event-dispatcher.interface";
import EventHandlerInterface from "./event-handler.interface";
import EventInterface from "./event.interface";

export default class EventDispatcher implements EventDispatcherInterface {

    private eventHandlers: Map<string, Set<EventHandlerInterface<EventInterface>>> = new Map();
    notify(event: EventInterface): void {
        const eventName = event.constructor.name;
        if (!this.eventHandlers.has(eventName)) {
            return;
        }
        this.eventHandlers.get(eventName)?.forEach((handler) => {
            handler.handle(event);
        });
    }
    register(eventName: string, eventHandler: EventHandlerInterface<EventInterface>): void {
        if (!this.eventHandlers.has(eventName)) {
            this.eventHandlers.set(eventName, new Set());
        }
        this.eventHandlers.get(eventName)?.add(eventHandler);
    }
    unregister(eventName: string, eventHandler: EventHandlerInterface<EventInterface>): void {
        if (!this.eventHandlers.has(eventName)) {
            return;
        }
        this.eventHandlers.get(eventName)?.delete(eventHandler);
    }
    unregisterAll(eventName: string): void {
        if (!this.eventHandlers.has(eventName)) {
            return;
        }
        this.eventHandlers.delete(eventName);
    }
    getEventHandlers(eventName: string): Set<EventHandlerInterface<EventInterface>> {
        return this.eventHandlers.get(eventName);
    }
}