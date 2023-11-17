"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = __importDefault(require("../controllers/product.controller"));
const productRouter = express_1.default.Router();
// productRouter.post("/create-product", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), productController.createProduct)
// productRouter.put("/update-product/:id", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), productController.updateProduct)
// productRouter.delete("/delete-product/:id", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), productController.deleteProduct)
// productRouter.get("/get-all-products", productController.getProducts)
productRouter.post("/create-product", product_controller_1.default.createProduct);
productRouter.put("/update-product/:id", product_controller_1.default.updateProduct);
productRouter.delete("/delete-product/:id", product_controller_1.default.deleteProduct);
productRouter.get("/get-all-products", product_controller_1.default.getProducts);
productRouter.get("/get-product/:id", product_controller_1.default.getProduct);
exports.default = productRouter;
