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
const cart_model_1 = __importDefault(require("../models/cart.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const createCart = (0, asyncError_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartData = req.body;
        if (!(cartData === null || cartData === void 0 ? void 0 : cartData.product_id))
            return next(new ErrorHandler_1.default("product id is required", http_status_1.default.BAD_REQUEST));
        const product = yield product_model_1.default.findById(cartData === null || cartData === void 0 ? void 0 : cartData.product_id);
        if (!product)
            return next(new ErrorHandler_1.default("product not found", http_status_1.default.BAD_REQUEST));
        const newCart = {
            product_name: cartData.product_name,
            product_id: cartData.product_id,
            price: cartData.price,
            product_image: cartData.product_image,
            email: cartData.email,
            product_quantity: product.quantity
        };
        yield cart_model_1.default.create(newCart);
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.CREATED,
            message: "cart added successfully"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const updateCartQuantity = (0, asyncError_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        if (!(data === null || data === void 0 ? void 0 : data.id) || !(data === null || data === void 0 ? void 0 : data.type))
            return next(new ErrorHandler_1.default("id and quantity update type is required", http_status_1.default.BAD_REQUEST));
        const type = data.type === "inc" ? 1 : -1;
        yield cart_model_1.default.findByIdAndUpdate(data.id, {
            $inc: {
                quantity: type
            }
        });
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.CREATED,
            message: "cart quantity update successfully"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const getCartByEmail = (0, asyncError_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const email = (_a = req.params) === null || _a === void 0 ? void 0 : _a.email;
        if (!email)
            return next(new ErrorHandler_1.default("email is required", http_status_1.default.BAD_REQUEST));
        const carts = yield cart_model_1.default.find({ email });
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.CREATED,
            data: carts
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const getIsCartExistByEmail = (0, asyncError_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, id } = req.query;
        if (!email || !id)
            return next(new ErrorHandler_1.default("email and id is required", http_status_1.default.BAD_REQUEST));
        const cart = yield cart_model_1.default.findOne({ email: email, product_id: id });
        if (cart) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: http_status_1.default.OK,
            });
        }
        else {
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_1.default.OK,
            });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const deleteCart = (0, asyncError_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const id = (_b = req.params) === null || _b === void 0 ? void 0 : _b.id;
        if (!id)
            return next(new ErrorHandler_1.default("id is required", http_status_1.default.BAD_REQUEST));
        yield cart_model_1.default.findByIdAndDelete(id);
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.CREATED,
            message: "cart deleted successfully"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const cartController = {
    createCart,
    updateCartQuantity,
    getCartByEmail,
    getIsCartExistByEmail,
    deleteCart
};
exports.default = cartController;
