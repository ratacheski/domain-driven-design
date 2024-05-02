import Address from "../../value-object/address";

export default class CustomerAddressChangedData {
  customerId: string;
  customerName: string;
  address: Address;

  constructor(customerId: string, customerName: string, address: Address) {
    this.customerId = customerId;
    this.customerName = customerName;
    this.address = address;
  }
}
