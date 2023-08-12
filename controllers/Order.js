import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const user = req.userId;
    const {
      order,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      discount,
      totalPrice,
    } = req.body;
    const orderItems = order.map((each) => ({ ...each, product: each._id }));

    const orderProduct = new Order({
      orderItems,
      shippingAddress,
      paymentMethod,
      user,
      itemsPrice,
      discount,
      totalPrice,
    });
    const newOrder = await orderProduct.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const details = req.body;
    const order = await Order.findById(id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: details.id,
        status: details.status,
        update_time: details.update_time,
        email_address: details.email_address,
      };
      const updatedOrder = await order.save();
      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order does not exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const user = req.userId;
    const userOrders = await Order.find({ user });
    res.status(200).json(userOrders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
