import { Order } from "../../Models/order.model.js";

export  const getOrders = async(req,res)=>{


    const { page , limit} = req.query;


    const totalOrdersCount= await Order.countDocuments();
    const totalPages=Math.ceil(totalOrdersCount/limit);
    const skip = (page -1 ) * limit;

    const orders = await Order.find()
    .skip(skip)
    .limit(limit)
    .populate("orderItems")
    // .populate("user" , "name email");



return res.status(200).json({message:"get orders controller works" , totalOrdersCount,totalPages ,orders})




};