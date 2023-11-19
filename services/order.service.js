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
const product_model_1 = __importDefault(require("../models/product.model"));
const mongodb_1 = require("mongodb");
const cart_model_1 = __importDefault(require("../models/cart.model"));
const addOrder = (0, asyncError_middleware_1.default)((orderData, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    try {
        if (orderData.order_type === "payment" || orderData.order_type === "subscription") {
            if (!(orderData === null || orderData === void 0 ? void 0 : orderData.packages))
                return next(new ErrorHandler_1.default("packages data required", http_status_1.default.BAD_REQUEST));
            if (orderData.order_type === "payment") {
                if (!orderData.transaction_id)
                    return next(new ErrorHandler_1.default("transaction id is required", http_status_1.default.BAD_REQUEST));
            }
            if (orderData.order_type === "subscription") {
                if (!orderData.subscription_id)
                    return next(new ErrorHandler_1.default("subscription id is required", http_status_1.default.BAD_REQUEST));
            }
            if (orderData.packages.type === "gift") {
                if (!orderData.gift.gift_message || !orderData.gift.gift_recipient_email || !orderData.gift.gift_message_date || !orderData.gift.shipping_date)
                    return next(new ErrorHandler_1.default("gift data is required", http_status_1.default.BAD_REQUEST));
            }
            const newOrder = {
                order_type: orderData.order_type,
                name: orderData.name,
                transaction_id: orderData.transaction_id,
                subscription_id: orderData.subscription_id,
                subscription_status: orderData.subscription_id && "active",
                company: orderData.company,
                contact_email: orderData.contact_email,
                email: orderData.email,
                packages: {
                    type: orderData.packages.type,
                    gender: orderData.packages.gender,
                    size: orderData.packages.size,
                    selected: orderData.packages.selected,
                    package: orderData.packages.package,
                    price: orderData.products_price,
                    gift: {
                        gift_message: (_a = orderData === null || orderData === void 0 ? void 0 : orderData.gift) === null || _a === void 0 ? void 0 : _a.gift_message,
                        gift_recipient_email: (_b = orderData === null || orderData === void 0 ? void 0 : orderData.gift) === null || _b === void 0 ? void 0 : _b.gift_recipient_email,
                        gift_message_date: (_c = orderData === null || orderData === void 0 ? void 0 : orderData.gift) === null || _c === void 0 ? void 0 : _c.gift_message_date,
                        shipping_date: (_d = orderData === null || orderData === void 0 ? void 0 : orderData.gift) === null || _d === void 0 ? void 0 : _d.shipping_date
                    }
                },
                delivery_info: {
                    country: orderData.delivery_info.country,
                    state: orderData.delivery_info.state,
                    address: orderData.delivery_info.address,
                    postcode: orderData.delivery_info.postcode,
                    city: orderData.delivery_info.city,
                    phone: orderData.delivery_info.phone,
                    apartment: (_e = orderData === null || orderData === void 0 ? void 0 : orderData.delivery_info) === null || _e === void 0 ? void 0 : _e.apartment
                },
                promotions: {
                    phone_number: (_f = orderData === null || orderData === void 0 ? void 0 : orderData.promotions) === null || _f === void 0 ? void 0 : _f.phone_number,
                    email: (_g = orderData === null || orderData === void 0 ? void 0 : orderData.promotions) === null || _g === void 0 ? void 0 : _g.email,
                },
            };
            yield order_model_1.default.create(newOrder);
            if (orderData.order_type === "subscription") {
                (0, sendResponse_1.default)(res, {
                    success: true,
                    statusCode: http_status_1.default.CREATED,
                    message: "subscription successfully",
                });
            }
            if (orderData.order_type === "payment") {
                (0, sendResponse_1.default)(res, {
                    success: true,
                    statusCode: http_status_1.default.CREATED,
                    message: "order successfully",
                });
            }
        }
        else if (orderData.order_type === "cart") {
            if (!(orderData === null || orderData === void 0 ? void 0 : orderData.products))
                return next(new ErrorHandler_1.default("product data is required", http_status_1.default.BAD_REQUEST));
            if (!(orderData === null || orderData === void 0 ? void 0 : orderData.cart_ids))
                return next(new ErrorHandler_1.default("cart ids is required", http_status_1.default.BAD_REQUEST));
            const updatedProducts = yield Promise.all(orderData.products.map(({ id, quantity }) => __awaiter(void 0, void 0, void 0, function* () {
                return product_model_1.default.findByIdAndUpdate(id, { $inc: { quantity: -quantity, already_sell: quantity } }, { new: true });
            })));
            if (updatedProducts) {
                const query = { _id: { $in: orderData.cart_ids.map((id) => new mongodb_1.ObjectId(id)) } };
                yield cart_model_1.default.deleteMany(query);
            }
            const newOrder = {
                order_type: orderData.order_type,
                name: orderData.name,
                products: orderData === null || orderData === void 0 ? void 0 : orderData.products,
                transaction_id: orderData.transaction_id,
                company: orderData.company,
                contact_email: orderData.contact_email,
                email: orderData.email,
                delivery_info: {
                    country: orderData.delivery_info.country,
                    state: orderData.delivery_info.state,
                    address: orderData.delivery_info.address,
                    postcode: orderData.delivery_info.postcode,
                    city: orderData.delivery_info.city,
                    phone: orderData.delivery_info.phone,
                    apartment: orderData === null || orderData === void 0 ? void 0 : orderData.apartment
                },
                promotions: {
                    phone_number: (_h = orderData === null || orderData === void 0 ? void 0 : orderData.promotions) === null || _h === void 0 ? void 0 : _h.phone_number,
                    email: (_j = orderData === null || orderData === void 0 ? void 0 : orderData.promotions) === null || _j === void 0 ? void 0 : _j.email,
                },
            };
            yield order_model_1.default.create(newOrder);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_1.default.CREATED,
                message: "order added successfully",
                data: updatedProducts
            });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
exports.default = addOrder;
