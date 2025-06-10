import { Router } from "express";
import { authMiddelware } from "../Middelwares/auth.middleware.js";
import { List_user_Orders, Order_details, Place_Order } from "../Controllers/Order.controller.js";

const router = Router();

router.post("/placeOrder" , authMiddelware , Place_Order)
router.get("/get-user-orders" , authMiddelware , List_user_Orders)
router.get("/get-order-by-id/:order_id" , authMiddelware , Order_details)

export default router