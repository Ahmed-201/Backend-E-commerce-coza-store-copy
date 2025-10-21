import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    userName: {
      type: String,
      required: true,
    },
    orderItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orderitem",
        required: true,
      },
    ],
    shippingAddress: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cashOnDelivery", "online"], // 👈 allowed values only
      required: true,
    },
    totalOrderPrice: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    isPaid:{
        type:Boolean,
        default:false
    },
    deliveredAt:{
        type:Date,
    },
  

  },
  { timestamps: true }
);


export const Order = mongoose.model("order", orderSchema);