import express from "express"
import layoutController from "../controllers/layout.controller"

const layoutRouter = express.Router()

layoutRouter.post("/create-layout", layoutController.createLayout)
layoutRouter.put("/update-featured-image", layoutController.updateFeaturedImage)
layoutRouter.put("/delete-multiple-images", layoutController.deleteMultipleFeaturedImages)
layoutRouter.delete("/delete-layout", layoutController.deleteLayout)
layoutRouter.get("/get-faqs", layoutController.getFaqs)
layoutRouter.get("/get-featured-images", layoutController.getFeaturedImage)

export default layoutRouter