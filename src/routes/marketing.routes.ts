import express from 'express'
import marketingController from '../controllers/marketing.controller'
import { authorizeRoles, isAuthenticated } from '../middleware/auth.middleware'
import { USER_ROLE } from '../enum/userRole'

const marketingRouter = express.Router()

// marketingRouter.get("/get-email-marketing-data", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), marketingController.getEmailMarketingData)
// marketingRouter.get("/get-phone-marketing-data", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), marketingController.getPhoneMarketingData)

marketingRouter.get("/get-email-marketing-data", marketingController.getEmailMarketingData)
marketingRouter.get("/get-phone-marketing-data", marketingController.getPhoneMarketingData)

export default marketingRouter