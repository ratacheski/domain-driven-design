import EventHandlerInterface from "../../@shared/event-handler.interface";
import CustomerAddressChangedEvent from "../customer-address-changed.event";

export default class EnviaConsoleLogHandler implements EventHandlerInterface {
    handle(event: CustomerAddressChangedEvent): void {
        const data = event.eventData;
        console.log(`Endereço do cliente: ${data.customerId}, ${data.customerName} alterado para: ${data.address.toString()}`)
    }
}   