"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contact_controller_1 = __importDefault(require("../controllers/contact.controller"));
const contactRouter = express_1.default.Router();
// contactRouter.post("/create-contact", contactController.createContact)
// contactRouter.get("/get-all-contacts", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), contactController.getAllContacts)
contactRouter.post("/create-contact", contact_controller_1.default.createContact);
contactRouter.get("/get-all-contacts", contact_controller_1.default.getAllContacts);
exports.default = contactRouter;
