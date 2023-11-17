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
const asyncError_middleware_1 = __importDefault(require("../middleware/asyncError.middleware"));
const http_status_1 = __importDefault(require("http-status"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const user_model_1 = __importDefault(require("../models/user.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
const contact_model_1 = __importDefault(require("../models/contact.model"));
const getTotalCreatedData = (0, asyncError_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalUser = yield user_model_1.default.estimatedDocumentCount();
        const totalOrder = yield order_model_1.default.estimatedDocumentCount();
        const totalReviews = yield order_model_1.default.find({ user_review: { $exists: true } }).countDocuments();
        const totalContacts = yield contact_model_1.default.estimatedDocumentCount();
        const analytics = {
            users: totalUser,
            orders: totalOrder,
            reviews: totalReviews,
            contacts: totalContacts
        };
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.CREATED,
            data: analytics
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const getRecentOrdersReviews = (0, asyncError_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield order_model_1.default.find({ user_review: { $exists: true } }).select("user_review email createdAt").sort({ createdAt: -1 }).limit(10);
        const orders = yield order_model_1.default.find().sort({ createdAt: -1 }).select("name  transaction_id subscription_id  order_status contact_email createdAt").limit(10);
        const analytics = {
            reviews,
            orders
        };
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.CREATED,
            data: analytics
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const analyticsController = {
    getTotalCreatedData,
    getRecentOrdersReviews
};
exports.default = analyticsController;
