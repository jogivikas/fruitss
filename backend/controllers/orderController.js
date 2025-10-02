import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// POST /api/orders
export const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }
  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });
  const created = await order.save();
  res.status(201).json(created);
});

// GET /api/orders/myorders
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(orders);
});

// GET /api/orders/:id
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  // only owner or admin can view
  if (
    order.user._id.toString() === req.user._id.toString() ||
    req.user.isAdmin
  ) {
    res.json(order);
  } else {
    res.status(403);
    throw new Error("Not authorized");
  }
});

// PUT /api/orders/:id/pay  (simple mark paid)
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  const updated = await order.save();
  res.json(updated);
});
