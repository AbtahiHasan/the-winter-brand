import express from "express";
import analyticsController from "../controllers/analytics.controller";
const analyticsRouter = express.Router()

analyticsRouter.get("/get-total-data-count", analyticsController.getTotalCreatedData)
analyticsRouter.get("/get-recent-orders-reviews", analyticsController.getRecentOrdersReviews)

export default analyticsRouter