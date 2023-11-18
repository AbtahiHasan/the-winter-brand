"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const marketing_controller_1 = __importDefault(require("../controllers/marketing.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const userRole_1 = require("../enum/userRole");
const marketingRouter = express_1.default.Router();
// only admin 
marketingRouter.get("/get-email-marketing-data", auth_middleware_1.isAuthenticated, (0, auth_middleware_1.authorizeRoles)(userRole_1.USER_ROLE.ADMIN), marketing_controller_1.default.getEmailMarketingData);
marketingRouter.get("/get-phone-marketing-data", auth_middleware_1.isAuthenticated, (0, auth_middleware_1.authorizeRoles)(userRole_1.USER_ROLE.ADMIN), marketing_controller_1.default.getPhoneMarketingData);
exports.default = marketingRouter;
