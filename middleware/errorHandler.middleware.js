"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const errorHandlerMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || http_status_1.default.INTERNAL_SERVER_ERROR;
    err.message = err.message || "Internal server error";
    if (err.name === "CastError") {
        const message = `Resourse not found invalid ${err.path}`;
        new ErrorHandler_1.default(message, http_status_1.default.BAD_REQUEST);
    }
    if (err.code === 11000) {
        const message = `Dublicate object keys ${Object.keys(err.keyValue)} entered`;
        new ErrorHandler_1.default(message, http_status_1.default.BAD_REQUEST);
    }
    if (err.name === "JsonWebTokenError") {
        const message = `Json web token is invalid, try again`;
        new ErrorHandler_1.default(message, http_status_1.default.BAD_REQUEST);
    }
    if (err.name === "TokenExpiredError") {
        const message = `json web token is expired, try again`;
        new ErrorHandler_1.default(message, http_status_1.default.BAD_REQUEST);
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
};
exports.default = errorHandlerMiddleware;
