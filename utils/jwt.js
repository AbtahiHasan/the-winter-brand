"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const app_1 = require("../app");
const sendToken = (user, statusCode, res) => {
    const accessToken = jsonwebtoken_1.default.sign({ email: user.email }, config_1.default.jwt.secret || "", {
        expiresIn: "365d"
    });
    app_1.nodeCache.set("user:" + user.email, JSON.stringify(user));
    res.status(statusCode).json({
        success: true,
        user,
        accessToken
    });
};
exports.default = sendToken;
