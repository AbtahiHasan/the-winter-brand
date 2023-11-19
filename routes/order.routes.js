"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = __importDefault(require("../controllers/order.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const userRole_1 = require("../enum/userRole");
const orderRouter = express_1.default.Router();
orderRouter.post("/create-order", auth_middleware_1.isAuthenticated, order_controller_1.default.createOrder);
orderRouter.post("/payment", auth_middleware_1.isAuthenticated, order_controller_1.default.newPayment);
orderRouter.post("/subscribe", auth_middleware_1.isAuthenticated, order_controller_1.default.newSubscribe);
orderRouter.post("/unsubscribe", auth_middleware_1.isAuthenticated, order_controller_1.default.unsubscribe);
orderRouter.get("/get-orders-by-email", auth_middleware_1.isAuthenticated, order_controller_1.default.getOrdersByEmail);
orderRouter.get("/get-invoice/:id", auth_middleware_1.isAuthenticated, order_controller_1.default.getInvoiceById);
// only admin 
orderRouter.delete("/delete-order/:id", auth_middleware_1.isAuthenticated, (0, auth_middleware_1.authorizeRoles)(userRole_1.USER_ROLE.ADMIN), order_controller_1.default.deleteOrder);
orderRouter.put("/update-order-status", auth_middleware_1.isAuthenticated, (0, auth_middleware_1.authorizeRoles)(userRole_1.USER_ROLE.ADMIN), order_controller_1.default.updateOrderStatus);
orderRouter.get("/search-orders/:query", auth_middleware_1.isAuthenticated, (0, auth_middleware_1.authorizeRoles)(userRole_1.USER_ROLE.ADMIN), order_controller_1.default.searchOrders);
// orderRouter.get("/get-orders", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), orderController.getOrders)
orderRouter.get("/get-orders", order_controller_1.default.getOrders);
orderRouter.get("/get-order/:id", auth_middleware_1.isAuthenticated, (0, auth_middleware_1.authorizeRoles)(userRole_1.USER_ROLE.ADMIN), order_controller_1.default.getSingleOrder);
exports.default = orderRouter;
