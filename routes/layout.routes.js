"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const layout_controller_1 = __importDefault(require("../controllers/layout.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const userRole_1 = require("../enum/userRole");
const layoutRouter = express_1.default.Router();
layoutRouter.get("/get-faqs", layout_controller_1.default.getFaqs);
layoutRouter.get("/get-featured-images", layout_controller_1.default.getFeaturedImage);
// admin only 
layoutRouter.post("/create-layout", auth_middleware_1.isAuthenticated, (0, auth_middleware_1.authorizeRoles)(userRole_1.USER_ROLE.ADMIN), layout_controller_1.default.createLayout);
layoutRouter.put("/update-featured-image", auth_middleware_1.isAuthenticated, (0, auth_middleware_1.authorizeRoles)(userRole_1.USER_ROLE.ADMIN), layout_controller_1.default.updateFeaturedImage);
layoutRouter.put("/delete-multiple-images", auth_middleware_1.isAuthenticated, (0, auth_middleware_1.authorizeRoles)(userRole_1.USER_ROLE.ADMIN), layout_controller_1.default.deleteMultipleFeaturedImages);
layoutRouter.delete("/delete-layout", auth_middleware_1.isAuthenticated, (0, auth_middleware_1.authorizeRoles)(userRole_1.USER_ROLE.ADMIN), layout_controller_1.default.deleteLayout);
exports.default = layoutRouter;
