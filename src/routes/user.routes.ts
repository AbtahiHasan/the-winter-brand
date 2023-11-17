import express from "express"
import userController from "../controllers/user.controller"
import { authorizeRoles, isAuthenticated } from "../middleware/auth.middleware"
import { USER_ROLE } from "../enum/userRole"

const userRouter = express.Router()


// userRouter.post("/user-registration", userController.createUser)
// userRouter.post("/login-user", userController.loginUser)
// userRouter.get("/get-all-users", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), userController.getAllUsers)
// userRouter.get("/get-user-role/:email", isAuthenticated, userController.getUserRole)
// userRouter.get("/logout", isAuthenticated, userController.logout)

userRouter.post("/user-registration", userController.createUser)
userRouter.post("/login-user", userController.loginUser)
userRouter.put("/update-user-profile", userController.updateUserProfile)
userRouter.put("/update-user-role", userController.updateUserRole)
userRouter.get("/get-all-users", userController.getAllUsers)
userRouter.get("/search-users/:query", userController.searchUsers)
userRouter.get("/get-user-role/:email", userController.getUserRole)
userRouter.get("/get-user-profile/:email", userController.getProfileByEmail)
userRouter.get("/logout", userController.logout)

export default userRouter