import Customer from "../../customer/entity/customer";
import Order from "../entity/order";
import OrderItem from "../entity/order_item";
import {v4 as uuidv4} from 'uuid';

export default class OrderService {
    static getTotal(orders: Order[]): number {
        return orders.reduce((total, order) => {
            return total + order.total();
        }, 0);
    }

    static placeOrder(customer: Customer, items: OrderItem[]): Order {
        if (!customer.isActive()) {
            throw new Error('Customer is not active');
        }
        if (items.length === 0) {
            throw new Error('Order must have at least one item');
        }
        const order = new Order(uuidv4(),customer.id, items);
        customer.increaseRewardPoints(order.total() / 2);
        return order;
    }
}