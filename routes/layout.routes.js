"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const layout_controller_1 = __importDefault(require("../controllers/layout.controller"));
const layoutRouter = express_1.default.Router();
layoutRouter.post("/create-layout", layout_controller_1.default.createLayout);
layoutRouter.put("/update-featured-image", layout_controller_1.default.updateFeaturedImage);
layoutRouter.put("/delete-multiple-images", layout_controller_1.default.deleteMultipleFeaturedImages);
layoutRouter.delete("/delete-layout", layout_controller_1.default.deleteLayout);
layoutRouter.get("/get-faqs", layout_controller_1.default.getFaqs);
layoutRouter.get("/get-featured-images", layout_controller_1.default.getFeaturedImage);
exports.default = layoutRouter;
