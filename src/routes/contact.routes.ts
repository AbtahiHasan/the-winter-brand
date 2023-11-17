import express from "express"
import contactController from "../controllers/contact.controller"
import { authorizeRoles, isAuthenticated } from "../middleware/auth.middleware"
import { USER_ROLE } from "../enum/userRole"

const contactRouter = express.Router()

// contactRouter.post("/create-contact", contactController.createContact)
// contactRouter.get("/get-all-contacts", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), contactController.getAllContacts)

contactRouter.post("/create-contact", contactController.createContact)
contactRouter.get("/get-all-contacts", contactController.getAllContacts)

export default contactRouter