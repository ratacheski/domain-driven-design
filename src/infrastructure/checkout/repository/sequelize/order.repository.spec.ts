import { Sequelize } from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import Address from "../../../../domain/customer/value-object/address";
import Customer from "../../../../domain/customer/entity/customer";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import ProductModel from "../../../product/repository/sequelize/product.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import OrderRepository from "./order.repository";
import ProductRepository from "../../../product/repository/sequelize/product.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create an order", async () => {
    // Arrange
    const customerRepository = new CustomerRepository();
    const customerId = uuidv4();
    const customer = new Customer(customerId, "Customer 1");
    const address = new Address(
      "123 Main St",
      "Springfield",
      "IL",
      "62701",
      "USA"
    );
    customer.changeAddress(address);
    await customerRepository.create(customer);
    
    const productRepository = new ProductRepository();
    const productId = uuidv4();
    const product = new Product(productId, "Shoes", 50);
    await productRepository.create(product);

    const orderItemId = uuidv4();
    const orderItem = new OrderItem(orderItemId,productId, product.name, product.price, 2);

    const orderId = uuidv4();
    const order = new Order(orderId, customerId, [orderItem]);

    // Act
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    // Assert
    const savedOrder = await OrderModel.findOne({where: {id: orderId}, include: OrderItemModel});
    expect(savedOrder.toJSON()).toStrictEqual({
      id: orderId,
      customer_id: customerId,
      total: order.total(),
      items: [
        {
          id: orderItemId,
          product_id: productId,
          order_id: orderId,
          quantity: orderItem.quantity,
          price: orderItem.price,
          name: orderItem.name,
        },
      ],
    });
  });

  it("should throw an error when order is not found", async () => {
    const orderRepository = new OrderRepository();

    expect(async () => {
      await orderRepository.find("456ABC");
    }).rejects.toThrow("Order not found");
  });


  it ("should find an order", async () => {
    // Arrange
    const customerRepository = new CustomerRepository();
    const customerId = uuidv4();
    const customer = new Customer(customerId, "Customer 1");
    const address = new Address(
      "123 Main St",
      "Springfield",
      "IL",
      "62701",
      "USA"
    );
    customer.changeAddress(address);
    await customerRepository.create(customer);
    
    const productRepository = new ProductRepository();
    const productId = uuidv4();
    const product = new Product(productId, "Shoes", 50);
    await productRepository.create(product);

    const orderItemId = uuidv4();
    const orderItem = new OrderItem(orderItemId,productId, product.name, product.price, 2);

    const orderId = uuidv4();
    const order = new Order(orderId, customerId, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    // Act
    const foundOrder = await orderRepository.find(orderId);

    // Assert
    expect(foundOrder).toStrictEqual(order);
  });

  it ("should find all orders", async () => {
    // Arrange
    const customerRepository = new CustomerRepository();
    const customerId = uuidv4();
    const customer = new Customer(customerId, "Customer 1");
    const address = new Address(
      "123 Main St",
      "Springfield",
      "IL",
      "62701",
      "USA"
    );
    customer.changeAddress(address);
    await customerRepository.create(customer);
    
    const productRepository = new ProductRepository();
    const productId = uuidv4();
    const product = new Product(productId, "Shoes", 50);
    await productRepository.create(product);

    const orderItemId = uuidv4();
    const orderItem = new OrderItem(orderItemId,productId, product.name, product.price, 2);

    const orderId = uuidv4();
    const order = new Order(orderId, customerId, [orderItem]);

    
    const order2ItemId = uuidv4();
    const order2Item = new OrderItem(order2ItemId,productId, product.name, product.price, 5);

    const order2Id = uuidv4();
    const order2 = new Order(order2Id, customerId, [order2Item]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);
    await orderRepository.create(order2);

    // Act
    const orders = await orderRepository.findAll();

    // Assert
    expect(orders).toHaveLength(2);
    expect(orders).toStrictEqual([order, order2]);
  });

  it("should update an order", async () => {
    // Arrange
    const customerRepository = new CustomerRepository();
    const customerId = uuidv4();
    const customer = new Customer(customerId, "Customer 1");
    const address = new Address(
      "123 Main St",
      "Springfield",
      "IL",
      "62701",
      "USA"
    );
    customer.changeAddress(address);
    await customerRepository.create(customer);
    
    const productRepository = new ProductRepository();
    const productId = uuidv4();
    const product = new Product(productId, "Shoes", 50);
    await productRepository.create(product);

    const orderItemId = uuidv4();
    const orderItem = new OrderItem(orderItemId,productId, product.name, product.price, 2);

    const orderId = uuidv4();
    const order = new Order(orderId, customerId, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const updatedOrderItem = new OrderItem(orderItemId,productId, product.name, product.price, 5);

    const product2Id = uuidv4();
    const product2 = new Product(product2Id, "Socks", 5);
    await productRepository.create(product2);
    const order2ItemId = uuidv4();
    const newOrderItem = new OrderItem(order2ItemId,product2Id, product2.name, product2.price, 3);
    const updatedOrder = new Order(orderId, customerId, [updatedOrderItem,newOrderItem]);

    // Act
    await orderRepository.update(updatedOrder);

    // Assert
    const savedOrder = await OrderModel.findOne({where: {id: orderId}, include: OrderItemModel});
    expect(savedOrder.toJSON()).toStrictEqual({
      id: orderId,
      customer_id: customerId,
      total: updatedOrder.total(),
      items: [
        {
          id: orderItemId,
          product_id: productId,
          order_id: orderId,
          quantity: updatedOrderItem.quantity,
          price: updatedOrderItem.price,
          name: updatedOrderItem.name,
        },
        {
          id: order2ItemId,
          product_id: product2Id,
          order_id: orderId,
          quantity: newOrderItem.quantity,
          price: newOrderItem.price,
          name: newOrderItem.name,
        },
      ],
    });
  });
});
