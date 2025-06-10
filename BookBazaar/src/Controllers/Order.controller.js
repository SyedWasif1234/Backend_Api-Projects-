import { db } from "../lib/db.js";

export const Place_Order = async(req, res) => {
    try {
        const user_id = req.user.id;
        const {bookId , status , shippingInfo , payment } = req.body;
        const order = await db.Order.create({
            data:{
                userId:user_id,
                bookId,
                status,
                shippingInfo,
                payment
            }
        })

        console.log(order);

        res.status(200).json({
            message:"order placed successfully",
            success: true ,
            order:order
        })
    } catch (error) {
        console.log("error occured  while placing order" , error)
        res.status(500).json({
            message:"error occured while placing order",
            error
        })  
    }
}

export const List_user_Orders = async(req, res) => {
    try {

        const list_of_user_order = await db.Order.findMany({
            where:{userId:req.user.id},
            include:{
                book:{
                    select:{
                        title:true,
                        author:true,
                        price:true
                    }
                }
            }

        })

        console.log(list_of_user_order)
        res.status(200).json({
            message:"all orders of user fetched successfully",
            success:true,
            orders:list_of_user_order
        })
        
    } catch (error) {
        console.log("error occured  while fetching list of user's order" , error)
        res.status(500).json({
            message:"error occured  while fetching list of user's orderr",
            error
        })
    }
}

export const Order_details = async(req, res) => {
    try {

        const {order_id} = req.params;
        const  user_id = req.user.id;

        if(!order_id) return res.status(500).json({message:"order_id is missing"});

        const OrderDetails = await db.Order.findUnique({
            where:{
                id:order_id,
                userId:user_id
            },
            include:{
                book:{
                    select:{
                        title:true,
                        author:true,
                        price:true
                    }
                }
            }
        })

        console.log(OrderDetails)
        res.status(200).json({
            message:"details of order by order id fetched successfully",
            order:OrderDetails
        })
        
    } catch (error) {
        console.log("error occured  while fetching user order by id" , error)
        res.status(500).json({
            message:"error occured  while fetching  user orderr by id",
            error
        })
    }
}
