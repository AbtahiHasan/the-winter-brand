"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const marketing_controller_1 = __importDefault(require("../controllers/marketing.controller"));
const marketingRouter = express_1.default.Router();
// marketingRouter.get("/get-email-marketing-data", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), marketingController.getEmailMarketingData)
// marketingRouter.get("/get-phone-marketing-data", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), marketingController.getPhoneMarketingData)
marketingRouter.get("/get-email-marketing-data", marketing_controller_1.default.getEmailMarketingData);
marketingRouter.get("/get-phone-marketing-data", marketing_controller_1.default.getPhoneMarketingData);
exports.default = marketingRouter;
