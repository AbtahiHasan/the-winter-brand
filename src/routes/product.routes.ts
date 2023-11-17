import express from "express"
import productController from "../controllers/product.controller"
import { authorizeRoles, isAuthenticated } from "../middleware/auth.middleware"
import { USER_ROLE } from "../enum/userRole"

const productRouter = express.Router()

// productRouter.post("/create-product", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), productController.createProduct)
// productRouter.put("/update-product/:id", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), productController.updateProduct)
// productRouter.delete("/delete-product/:id", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), productController.deleteProduct)
// productRouter.get("/get-all-products", productController.getProducts)

productRouter.post("/create-product", productController.createProduct)
productRouter.put("/update-product/:id", productController.updateProduct)
productRouter.delete("/delete-product/:id", productController.deleteProduct)
productRouter.get("/get-all-products", productController.getProducts)
productRouter.get("/get-product/:id", productController.getProduct)

export default productRouter