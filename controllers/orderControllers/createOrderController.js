import { Product } from "../../Models/product.model.js";
import { Order } from "../../Models/order.model.js";
import { orderItem } from "../../Models/orderItem.model.js";

export const orderController = async (req, res) => {
  const {
    userId,
    userName,
    shippingAddress,
    paymentMethod,
    totalOrderPrice,
    orderStatus,
    orderItems,
  } = req.body;

  console.log(orderItems, "orderItemss");
  if (!userId || !userName || !shippingAddress || !totalOrderPrice) {
    return res.status(400).json({ message: "all feilds are requiredd" });
  }

  if (
    (typeof totalOrderPrice === "string" && totalOrderPrice.trim() === "") ||
    totalOrderPrice <= 0
  ) {
    return res.status(400).json({ message: "total order price is required" });
  }

  if (orderItems.length === 0) {
    return res
      .status(400)
      .json({ message: "atleast one order item is required" });
  }

  // --- Validate each order item
  const invalidItem = orderItems.find(
    (item) =>
      !item.productId ||
      !item.productName ||
      item.quantity == null ||
      item.price == null ||
      item.quantity <= 0 ||
      item.price <= 0
  );

  if (invalidItem) {
    return res.status(400).json({
      message:
        "Each order item must have valid productId, name, quantity (>0), and price (>0)",
    });
  }

  if (
    orderStatus &&
    !["pending", "shipped", "delivered", "cancelled"].includes(orderStatus)
  ) {
    return res.status(400).json({ message: "invalid order status" });
  }
  ///   if payment method is changed in future this validation also changed
  if (paymentMethod && !["cashOnDelivery", "online"].includes(paymentMethod)) {
    return res.status(400).json({ message: "invalid payment method" });
  }

  // --- Check product availability and update stock
  let totalOrderCalculatedPrice = 0;
  let orderItemsSaved = [];

  try {
    //  agr es loop m koi product nhi mila to wo 404 error de dega aur agr stock kam hua to 400 error de dega
    for (const item of orderItems) {

      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.quantity < item.quantity) {
        return res
          .status(400)
          .json({ message: `${product.name} has insufficient stock` });
      }

      // ✅ Add to total order price
      totalOrderCalculatedPrice += product.price * item.quantity;
    }

    for (const item of orderItems) {

      //  ek ek order item ko save kar raha hai    
      const OrderItemSaved = await new orderItem({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color,
      }).save();

      orderItemsSaved.push({ orderItem: OrderItemSaved });

      console.log(orderItemsSaved, "orderItemsSaved");

      // --- Decrease product stock
      const response = await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity },
      });
      console.log(response, "product stock updated");
    }
    
  } catch (error) {
    console.log(error, "error updating product quantity");
  }

  try {
    // orderItemsSaved array m se sirf orderItem._id nikali hai
    const orderItemIds = orderItemsSaved.map((item) => item.orderItem._id);

    const orderData = {
      userId,
      userName,
      orderItems: orderItemIds,
      shippingAddress,
      paymentMethod,
      totalOrderPrice: totalOrderCalculatedPrice,
      orderStatus,
    };

    const order = await new Order(orderData).save();

    return res
      .status(201)
      .json({ message: "order created successfully", order: order });
  } catch (error) {
    console.log(error, "created order error");
  }
};
