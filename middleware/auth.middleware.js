"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const asyncError_middleware_1 = __importDefault(require("./asyncError.middleware"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config"));
const app_1 = require("../app");
exports.isAuthenticated = (0, asyncError_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const access_token = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
    if (!access_token) {
        return next(new ErrorHandler_1.default("Please login", http_status_1.default.BAD_REQUEST));
    }
    const decoded = jsonwebtoken_1.default.verify(access_token, config_1.default.jwt.secret);
    if (!decoded) {
        return next(new ErrorHandler_1.default("access token is not valid", http_status_1.default.BAD_REQUEST));
    }
    const chachedUser = app_1.nodeCache.get("user:" + decoded.email);
    if (!chachedUser) {
        return next(new ErrorHandler_1.default("user not found", http_status_1.default.BAD_REQUEST));
    }
    const user = JSON.parse(chachedUser);
    req.user = user;
    next();
}));
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        var _a, _b;
        if (!roles.includes(((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) || "")) {
            return next(new ErrorHandler_1.default(`Role: ${(_b = req.user) === null || _b === void 0 ? void 0 : _b.role} is not allowed`, http_status_1.default.BAD_REQUEST));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
