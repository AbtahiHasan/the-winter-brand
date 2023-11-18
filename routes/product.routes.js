"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = __importDefault(require("../controllers/product.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const userRole_1 = require("../enum/userRole");
const productRouter = express_1.default.Router();
productRouter.get("/get-all-products", product_controller_1.default.getProducts);
productRouter.get("/get-product/:id", product_controller_1.default.getProduct);
// admin only 
productRouter.post("/create-product", auth_middleware_1.isAuthenticated, (0, auth_middleware_1.authorizeRoles)(userRole_1.USER_ROLE.ADMIN), product_controller_1.default.createProduct);
productRouter.put("/update-product/:id", auth_middleware_1.isAuthenticated, (0, auth_middleware_1.authorizeRoles)(userRole_1.USER_ROLE.ADMIN), product_controller_1.default.updateProduct);
productRouter.delete("/delete-product/:id", auth_middleware_1.isAuthenticated, (0, auth_middleware_1.authorizeRoles)(userRole_1.USER_ROLE.ADMIN), product_controller_1.default.deleteProduct);
exports.default = productRouter;
