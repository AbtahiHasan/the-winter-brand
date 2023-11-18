"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const review_controller_1 = __importDefault(require("../controllers/review.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const userRole_1 = require("../enum/userRole");
const reviewRouter = express_1.default.Router();
reviewRouter.post("/create-review", auth_middleware_1.isAuthenticated, review_controller_1.default.createReview);
// only admin
reviewRouter.get("/get-all-reviews", auth_middleware_1.isAuthenticated, (0, auth_middleware_1.authorizeRoles)(userRole_1.USER_ROLE.ADMIN), review_controller_1.default.getReviews);
exports.default = reviewRouter;
