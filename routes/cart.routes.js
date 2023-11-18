"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_controller_1 = __importDefault(require("../controllers/cart.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const cartRouter = express_1.default.Router();
cartRouter.post("/create-cart", auth_middleware_1.isAuthenticated, cart_controller_1.default.createCart);
cartRouter.put("/update-cart-product-quantity", auth_middleware_1.isAuthenticated, cart_controller_1.default.updateCartQuantity);
cartRouter.get("/get-cart/:email", auth_middleware_1.isAuthenticated, cart_controller_1.default.getCartByEmail);
cartRouter.get("/get-cart-is-exist", auth_middleware_1.isAuthenticated, cart_controller_1.default.getIsCartExistByEmail);
cartRouter.delete("/delete-cart/:id", auth_middleware_1.isAuthenticated, cart_controller_1.default.deleteCart);
exports.default = cartRouter;
