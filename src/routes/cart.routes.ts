import express from "express"
import cartController from "../controllers/cart.controller"

const cartRouter = express.Router()
cartRouter.post("/create-cart", cartController.createCart)
cartRouter.put("/update-cart-product-quantity", cartController.updateCartQuantity)
cartRouter.get("/get-cart/:email", cartController.getCartByEmail)
cartRouter.get("/get-cart-is-exist", cartController.getIsCartExistByEmail)
cartRouter.delete("/delete-cart/:id", cartController.deleteCart)

export default cartRouter