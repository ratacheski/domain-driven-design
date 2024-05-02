import { Transaction } from "sequelize";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderModel from "./order.model";
import OrderItemModel from "./order-item.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          product_id: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      },
      {
        include: OrderModel.associations.items,
      }
    );
  }

  async update(entity: Order): Promise<void> {
    const transaction = await OrderModel.sequelize.transaction();
    try {
      await this.updateOrder(entity, transaction);
      await this.updateOrderItems(entity, transaction);
      await transaction.commit();
    } catch (error) {
      console.log(error);
      
      await transaction.rollback();
      throw error;
    }
  }
  async updateOrderItems(
    entity: Order,
    transaction: Transaction
  ): Promise<void> {
    await OrderModel.findByPk(entity.id, {
      include: OrderModel.associations.items,
      transaction,
    }).then(async (orderModel) => {
      const orderItems = orderModel.items;
      const items = entity.items;
      const itemsToRemove = orderItems.filter(
        (item) => !items.find((i) => i.id === item.id)
      );
      const itemsToAdd = items.filter(
        (item) => !orderItems.find((i) => i.id === item.id)
      );
      const itemsToUpdate = items.filter((item) =>
        orderItems.find((i) => i.id === item.id)
      );
      await Promise.all([
        OrderItemModel.bulkCreate(
          itemsToAdd.map((item) => ({
            id: item.id,
            product_id: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            order_id: entity.id,
          })),
          { transaction }
        ),
        OrderItemModel.destroy({
          where: {
            id: itemsToRemove.map((item) => item.id),
          },
          transaction,
        }),
        Promise.all(
          itemsToUpdate.map((item) =>
            OrderItemModel.update(
              {
                product_id: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
              },
              {
                where: {
                  id: item.id,
                },
                transaction,
              }
            )
          )
        ),
      ]);
    });
  }
  async updateOrder(entity: Order, transaction: Transaction): Promise<void> {
    await OrderModel.update(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
      },
      {
        where: {
          id: entity.id,
        },
        transaction,
      }
    );
  }
  async find(id: string): Promise<Order> {
    let orderModel;
    try {
      orderModel = await OrderModel.findOne({
        where: {
          id,
        },
        include: OrderModel.associations.items,
        rejectOnEmpty: true,
      });
    } catch (error) {
      throw new Error("Order not found");
    }
    return new Order(
      id,
      orderModel.customer_id,
      orderModel.items.map(
        (item) =>
          new OrderItem(
            item.id,
            item.product_id,
            item.name,
            item.price,
            item.quantity
          )
      )
    );
  }
  async findAll(): Promise<Order[]> {
    const orders = await OrderModel.findAll({
      include: OrderModel.associations.items,
    });
    return orders.map((order) => {
      return new Order(
        order.id,
        order.customer_id,
        order.items.map(
          (item) =>
            new OrderItem(
              item.id,
              item.product_id,
              item.name,
              item.price,
              item.quantity
            )
        )
      );
    });
  }
}
