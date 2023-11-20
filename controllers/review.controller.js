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
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const order_model_1 = __importDefault(require("../models/order.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const createReview = (0, asyncError_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const orderId = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.order_id;
        if (!orderId)
            return next(new ErrorHandler_1.default("order id required", http_status_1.default.OK));
        const reviewData = req.body;
        const order = yield order_model_1.default.findById(orderId);
        let avatar = "";
        if (order) {
            const isUserExits = yield user_model_1.default.findOne({ email: order.email });
            if (isUserExits) {
                avatar = (isUserExits === null || isUserExits === void 0 ? void 0 : isUserExits.avatar) || "";
            }
        }
        if (!order)
            return next(new ErrorHandler_1.default("Invalid order id", http_status_1.default.BAD_REQUEST));
        const newReview = {
            rating: reviewData.rating,
            name: reviewData.name,
            review: reviewData.review,
            avatar: avatar
        };
        order.user_review = newReview;
        yield (order === null || order === void 0 ? void 0 : order.save());
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.CREATED,
            message: 'review successfully added'
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const getReviews = (0, asyncError_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    try {
        let skip = parseInt((((_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.skip) || "0"));
        let limit = parseInt((((_c = req === null || req === void 0 ? void 0 : req.query) === null || _c === void 0 ? void 0 : _c.limit) || "20"));
        const reviews = yield order_model_1.default.find({ user_review: { $exists: true } }).select("user_review email").sort({ createdAt: -1 }).skip(skip).limit(limit);
        const totalReviews = yield order_model_1.default.countDocuments({ user_review: { $exists: true } });
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.OK,
            data: reviews,
            meta: {
                total: totalReviews
            }
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const reviewController = {
    createReview,
    getReviews,
};
exports.default = reviewController;
