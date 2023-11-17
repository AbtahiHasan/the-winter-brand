"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const analytics_controller_1 = __importDefault(require("../controllers/analytics.controller"));
const analyticsRouter = express_1.default.Router();
analyticsRouter.get("/get-total-data-count", analytics_controller_1.default.getTotalCreatedData);
analyticsRouter.get("/get-recent-orders-reviews", analytics_controller_1.default.getRecentOrdersReviews);
exports.default = analyticsRouter;
