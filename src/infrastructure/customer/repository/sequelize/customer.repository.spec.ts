import { Sequelize } from "sequelize-typescript";
import CustomerRepository from "./customer.repository";
import Address from "../../../../domain/customer/value-object/address";
import Customer from "../../../../domain/customer/entity/customer";
import CustomerModel from "./customer.model";
import { v4 as uuidv4 } from "uuid";

describe("Customer repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([CustomerModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a customer", async () => {
    const customerRepository = new CustomerRepository();
    const id = uuidv4();
    const customer = new Customer(id, "Customer 1");
    const address = new Address(
      "123 Main St",
      "Springfield",
      "IL",
      "62701",
      "USA"
    );
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const customerModel = await CustomerModel.findOne({ where: { id } });

    expect(customerModel.toJSON()).toStrictEqual({
      id,
      name: customer.name,
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints,
      street: address.street,
      zipcode: address.zip,
      city: address.city,
      state: address.state,
      country: address.country,
    });
  });

  it("should update a customer", async () => {
    const customerRepository = new CustomerRepository();
    const id = uuidv4();
    const customer = new Customer(id, "Customer 1");
    const address = new Address(
      "123 Main St",
      "Springfield",
      "IL",
      "62701",
      "USA"
    );
    customer.changeAddress(address);
    await customerRepository.create(customer);

    customer.changeName("Customer 2");
    await customerRepository.update(customer);
    const customerModel = await CustomerModel.findOne({ where: { id } });

    expect(customerModel.toJSON()).toStrictEqual({
      id,
      name: customer.name,
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints,
      street: address.street,
      zipcode: address.zip,
      city: address.city,
      state: address.state,
      country: address.country,
    });
  });

  it("should find a customer", async () => {
    const customerRepository = new CustomerRepository();
    const id = uuidv4();
    const customer = new Customer(id, "Customer 1");
    const address = new Address(
      "123 Main St",
      "Springfield",
      "IL",
      "62701",
      "USA"
    );
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const customerResult = await customerRepository.find(customer.id);

    expect(customer).toStrictEqual(customerResult);
  });

  it("should throw an error when customer is not found", async () => {
    const customerRepository = new CustomerRepository();

    expect(async () => {
      await customerRepository.find("456ABC");
    }).rejects.toThrow("Customer not found");
  });

  it("should find all customers", async () => {
    const customerRepository = new CustomerRepository();
    const id1 = uuidv4();
    const customer1 = new Customer(id1, "Customer 1");
    const address1 = new Address(
      "123 Main St",
      "Springfield",
      "IL",
      "62701",
      "USA"
    );
    customer1.changeAddress(address1);
    customer1.increaseRewardPoints(10);
    customer1.activate();

    const id2 = uuidv4();
    const customer2 = new Customer(id2, "Customer 2");
    const address2 = new Address(
      "456 Main St",
      "Springfield",
      "IL",
      "62701",
      "USA"
    );
    customer2.changeAddress(address2);
    customer2.increaseRewardPoints(20);

    await customerRepository.create(customer1);
    await customerRepository.create(customer2);

    const customers = await customerRepository.findAll();

    expect(customers).toHaveLength(2);
    expect(customers).toContainEqual(customer1);
    expect(customers).toContainEqual(customer2);
  });
});
