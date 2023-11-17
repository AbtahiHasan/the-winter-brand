"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenOption = exports.accessTokenOption = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const app_1 = require("../app");
const accessTokenExpire = parseInt(config_1.default.jwt.expires_in || "300", 10);
const refreshTokenExpire = parseInt(config_1.default.jwt.refresh_expires_in || "1200", 10);
exports.accessTokenOption = {
    exprire: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
    maxAge: accessTokenExpire * 60 * 60 * 1000,
    httpOnly: true,
    semeSite: "lex",
    secure: config_1.default.env === "production",
};
exports.refreshTokenOption = {
    exprire: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
    maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
    httpOnly: true,
    semeSite: "lex",
    secure: config_1.default.env === "production",
};
const sendToken = (user, statusCode, res) => {
    const accessToken = jsonwebtoken_1.default.sign({ email: user.email }, config_1.default.jwt.secret || "", {
        expiresIn: "5m"
    });
    const refreshToken = jsonwebtoken_1.default.sign({ email: user.email }, config_1.default.jwt.refresh_secret || "", {
        expiresIn: "3d"
    });
    app_1.nodeCache.set("user:" + user.email, JSON.stringify(user));
    res.cookie("access_token", accessToken, exports.accessTokenOption);
    res.cookie("refresh_token", refreshToken, exports.refreshTokenOption);
    res.status(statusCode).json({
        success: true,
        user,
        accessToken
    });
};
exports.default = sendToken;
