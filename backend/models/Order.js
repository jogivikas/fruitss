import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  name: String,
  qty: Number,
  image: String,
  price: Number,
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
});

const shippingSchema = new mongoose.Schema({
  fullName: String,
  address: String,
  city: String,
  postalCode: String,
  country: String,
  phone: String,
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: [orderItemSchema],
    shippingAddress: shippingSchema,
    paymentMethod: { type: String },
    itemsPrice: Number,
    taxPrice: Number,
    shippingPrice: Number,
    totalPrice: Number,
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
