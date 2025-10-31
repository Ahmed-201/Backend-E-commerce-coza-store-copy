import { Order } from "../../Models/order.model.js";
import mongoose from "mongoose";

export const updateOrderById = async (req, res) => {
  const orderId = req.params.orderId;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
     return res.status(400).json({ message: "id invalid" });
   }
  const { orderStatus } = req.body;

  console.log(orderStatus, "ordeStatus");

  if (!orderStatus) {
    return res.status(400).json({ message: "order status is required " });
  }
 if (!["pending", "shipped", "delivered", "cancelled"].includes(orderStatus)) {
  return res.status(400).json({ message: "order status is required! correct" });
}

    const orderUpdateResponse = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: orderStatus },
      { new: true }
    );

    if(!orderUpdateResponse){

            return res.status(404).json({message:"order not found"})
    }
    
  res
    .status(200)
    .json({
      message: `Update order by id controller working fine for orderId: ${orderId}  ` , orderUpdateResponse
    });
};
