import express from "express"
import orderController from "../controllers/order.controller"
import { authorizeRoles, isAuthenticated } from "../middleware/auth.middleware"
import { USER_ROLE } from "../enum/userRole"

const orderRouter = express.Router()

// orderRouter.post("/create-order", orderController.createOrder)
// orderRouter.post("/payment", orderController.newPayment)
// orderRouter.post("/subscribe", orderController.newSubscribe)
// orderRouter.put("/update-order-status/:id", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), orderController.updateOrderStatus)
// orderRouter.delete("/delete-order/:id", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), orderController.deleteOrder)
// orderRouter.get("/get-orders", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), orderController.getOrders)




orderRouter.post("/create-order", orderController.createOrder)
orderRouter.post("/payment", orderController.newPayment)
orderRouter.post("/subscribe", orderController.newSubscribe)
orderRouter.post("/unsubscribe", orderController.unsubscribe)
orderRouter.put("/update-order-status", orderController.updateOrderStatus)
orderRouter.delete("/delete-order/:id", orderController.deleteOrder)
orderRouter.get("/get-orders", orderController.getOrders)
orderRouter.get("/search-orders/:query", orderController.searchOrders)
orderRouter.get("/get-orders-by-email", orderController.getOrdersByEmail)
orderRouter.get("/get-invoice/:id", orderController.getInvoiceById)
// only admin 
orderRouter.get("/get-order/:id", orderController.getSingleOrder)


export default orderRouter