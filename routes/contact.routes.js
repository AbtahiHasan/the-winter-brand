"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contact_controller_1 = __importDefault(require("../controllers/contact.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const userRole_1 = require("../enum/userRole");
const contactRouter = express_1.default.Router();
contactRouter.post("/create-contact", contact_controller_1.default.createContact);
// only admin 
contactRouter.get("/get-all-contacts", auth_middleware_1.isAuthenticated, (0, auth_middleware_1.authorizeRoles)(userRole_1.USER_ROLE.ADMIN), contact_controller_1.default.getAllContacts);
exports.default = contactRouter;
