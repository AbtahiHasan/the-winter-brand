"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const review_controller_1 = __importDefault(require("../controllers/review.controller"));
const reviewRouter = express_1.default.Router();
// reviewRouter.post("/create-review", reviewController.createReview)
// reviewRouter.delete("/delete-reviews/:id", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), reviewController.deleteReview)
// reviewRouter.get("/get-all-reviews", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), reviewController.getAllReviews)
// reviewRouter.get("/get-reviews", reviewController.getReviews)
reviewRouter.post("/create-review", review_controller_1.default.createReview);
reviewRouter.get("/get-all-reviews", review_controller_1.default.getReviews);
exports.default = reviewRouter;
