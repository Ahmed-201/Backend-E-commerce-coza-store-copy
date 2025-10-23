import { Order } from "../../Models/order.model.js";

export const getOrderById = async (req,res)=>{

    const{ orderId } = req.query;

    if(!orderId){
        return res.status(400).json({message:"orderId required"})
    }

    const order= await Order.findById(orderId).populate("orderItems")

    return res.status(200).json({message:"working orderById controller" , order})



}