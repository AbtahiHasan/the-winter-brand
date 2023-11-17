import express from "express"
import reviewController from "../controllers/review.controller"
import { authorizeRoles, isAuthenticated } from "../middleware/auth.middleware"
import { USER_ROLE } from "../enum/userRole"

const reviewRouter = express.Router()

// reviewRouter.post("/create-review", reviewController.createReview)
// reviewRouter.delete("/delete-reviews/:id", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), reviewController.deleteReview)
// reviewRouter.get("/get-all-reviews", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), reviewController.getAllReviews)
// reviewRouter.get("/get-reviews", reviewController.getReviews)

reviewRouter.post("/create-review", reviewController.createReview)
reviewRouter.get("/get-all-reviews", reviewController.getReviews)



export default reviewRouter