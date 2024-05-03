import EventInterface from "../@shared/event.interface";
import CustomerAddressChangedData from "./dto/customer-address-changed-data.dto";

export default class CustomerAddressChangedEvent implements EventInterface {
  dataTimeOcurred: Date;
  eventData: CustomerAddressChangedData;

  constructor(eventData: CustomerAddressChangedData) {
    this.dataTimeOcurred = new Date();
    this.eventData = eventData;
  }
}
