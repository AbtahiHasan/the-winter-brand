"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const userRouter = express_1.default.Router();
// userRouter.post("/user-registration", userController.createUser)
// userRouter.post("/login-user", userController.loginUser)
// userRouter.get("/get-all-users", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), userController.getAllUsers)
// userRouter.get("/get-user-role/:email", isAuthenticated, userController.getUserRole)
// userRouter.get("/logout", isAuthenticated, userController.logout)
userRouter.post("/user-registration", user_controller_1.default.createUser);
userRouter.post("/login-user", user_controller_1.default.loginUser);
userRouter.put("/update-user-profile", user_controller_1.default.updateUserProfile);
userRouter.put("/update-user-role", user_controller_1.default.updateUserRole);
userRouter.get("/get-all-users", user_controller_1.default.getAllUsers);
userRouter.get("/search-users/:query", user_controller_1.default.searchUsers);
userRouter.get("/get-user-role/:email", user_controller_1.default.getUserRole);
userRouter.get("/get-user-profile/:email", user_controller_1.default.getProfileByEmail);
userRouter.get("/logout", user_controller_1.default.logout);
exports.default = userRouter;
