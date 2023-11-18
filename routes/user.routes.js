"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const userRole_1 = require("../enum/userRole");
const userRouter = express_1.default.Router();
userRouter.post("/user-registration", user_controller_1.default.createUser);
userRouter.post("/login-user", user_controller_1.default.loginUser);
userRouter.put("/update-user-profile", auth_middleware_1.isAuthenticated, user_controller_1.default.updateUserProfile);
userRouter.get("/get-user-role/:email", auth_middleware_1.isAuthenticated, user_controller_1.default.getUserRole);
userRouter.get("/get-user-profile/:email", auth_middleware_1.isAuthenticated, user_controller_1.default.getProfileByEmail);
userRouter.get("/logout", auth_middleware_1.isAuthenticated, user_controller_1.default.logout);
// only admin 
userRouter.put("/update-user-role", auth_middleware_1.isAuthenticated, (0, auth_middleware_1.authorizeRoles)(userRole_1.USER_ROLE.ADMIN), user_controller_1.default.updateUserRole);
userRouter.get("/search-users/:query", auth_middleware_1.isAuthenticated, (0, auth_middleware_1.authorizeRoles)(userRole_1.USER_ROLE.ADMIN), user_controller_1.default.searchUsers);
userRouter.get("/get-all-users", auth_middleware_1.isAuthenticated, (0, auth_middleware_1.authorizeRoles)(userRole_1.USER_ROLE.ADMIN), user_controller_1.default.getAllUsers);
exports.default = userRouter;
