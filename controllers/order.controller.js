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
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const http_status_1 = __importDefault(require("http-status"));
const order_model_1 = __importDefault(require("../models/order.model"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../config"));
const asyncError_middleware_1 = __importDefault(require("../middleware/asyncError.middleware"));
const order_service_1 = __importDefault(require("../services/order.service"));
const stripe = new stripe_1.default(config_1.default.payment_secret || "", {
    apiVersion: "2023-10-16",
});
const createOrder = (0, asyncError_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderData = req.body;
        if (orderData.order_type === "subscription" && (orderData === null || orderData === void 0 ? void 0 : orderData.transaction_id)) {
            const paymentIntentId = orderData === null || orderData === void 0 ? void 0 : orderData.transaction_id;
            const paymentIntent = yield stripe.paymentIntents.retrieve(paymentIntentId);
            if (paymentIntent.status !== "succeeded") {
                return next(new ErrorHandler_1.default("payment not authorized!", http_status_1.default.BAD_GATEWAY));
            }
        }
        (0, order_service_1.default)(orderData, res, next);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
// only admin
const updateOrderStatus = (0, asyncError_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const orderId = req.body.order_id;
        const status = (_a = req.body) === null || _a === void 0 ? void 0 : _a.order_status;
        if (!orderId || !status)
            return next(new ErrorHandler_1.default("order id and status is required", http_status_1.default.BAD_REQUEST));
        if (!status) {
            return next(new ErrorHandler_1.default("status is required", http_status_1.default.BAD_REQUEST));
        }
        const statusOptions = [
            "pending",
            "completed",
            "returned",
            "canceled",
        ];
        if (!statusOptions.includes(status)) {
            return next(new ErrorHandler_1.default("invalid status", http_status_1.default.BAD_REQUEST));
        }
        yield order_model_1.default.findByIdAndUpdate(orderId, {
            $set: {
                order_status: status,
            },
        }, { new: true });
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.CREATED,
            message: "order status updated successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
// only admin
const deleteOrder = (0, asyncError_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const orderId = (_b = req.params) === null || _b === void 0 ? void 0 : _b.id;
        yield order_model_1.default.findByIdAndDelete(orderId);
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.CREATED,
            message: "order deleted successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const getOrders = (0, asyncError_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e, _f, _g;
    try {
        let skip = parseInt((((_c = req === null || req === void 0 ? void 0 : req.query) === null || _c === void 0 ? void 0 : _c.skip) || "0"));
        let limit = parseInt((((_d = req === null || req === void 0 ? void 0 : req.query) === null || _d === void 0 ? void 0 : _d.limit) || "20"));
        const orderTap = ((_e = req === null || req === void 0 ? void 0 : req.query) === null || _e === void 0 ? void 0 : _e.tap) || "all";
        const type = !((_f = req === null || req === void 0 ? void 0 : req.query) === null || _f === void 0 ? void 0 : _f.type) ? ["payment", "cart"] : ((_g = req === null || req === void 0 ? void 0 : req.query) === null || _g === void 0 ? void 0 : _g.type) === "subscription" ? ["subscription"] : ["payment", "cart"];
        const query = orderTap === "all" ? {} : { order_status: orderTap };
        const orders = yield order_model_1.default.find({ $and: [{ order_type: { $in: type } }, query] }).sort({ createdAt: -1 }).skip(skip).limit(limit);
        const cartPaymentCount = yield order_model_1.default.countDocuments({ $and: [{ order_type: { $in: ["payment", "cart"] } }, query] });
        const subscriptionCount = yield order_model_1.default.countDocuments({ $and: [{ order_type: { $in: ["subscription"] } }, query] });
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.CREATED,
            data: orders,
            meta: {
                payment: cartPaymentCount,
                subscription: subscriptionCount
            }
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const searchOrders = (0, asyncError_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _h, _j, _k;
    try {
        const query = (_h = req === null || req === void 0 ? void 0 : req.params) === null || _h === void 0 ? void 0 : _h.query;
        if (!query)
            return next(new ErrorHandler_1.default("search query is required", http_status_1.default.BAD_REQUEST));
        let skip = parseInt((((_j = req === null || req === void 0 ? void 0 : req.query) === null || _j === void 0 ? void 0 : _j.skip) || "0"));
        let limit = parseInt((((_k = req === null || req === void 0 ? void 0 : req.query) === null || _k === void 0 ? void 0 : _k.limit) || "20"));
        const orders = yield order_model_1.default.find({
            $or: [
                { transaction_id: { $regex: query, $options: "i" } },
                { subscription_id: { $regex: query, $options: "i" } }
            ]
        }).sort({ createdAt: -1 }).skip(skip).limit(limit);
        // const orders = await orderModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.CREATED,
            data: orders,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const getOrdersByEmail = (0, asyncError_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _l;
    try {
        const email = (_l = req === null || req === void 0 ? void 0 : req.query) === null || _l === void 0 ? void 0 : _l.email;
        if (!email)
            return next(new ErrorHandler_1.default("email is required", http_status_1.default.BAD_REQUEST));
        const orders = yield order_model_1.default.find({ email }).select("name transaction_id order_status email delivery_info.address createdAt subscription_id user_review subscription_status").sort({ createdAt: -1 });
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.CREATED,
            data: orders,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
// payments
const newPayment = (0, asyncError_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _m;
    try {
        const amount = (_m = req.body) === null || _m === void 0 ? void 0 : _m.amount;
        if (!amount)
            return next(new ErrorHandler_1.default("amount is required", http_status_1.default.BAD_REQUEST));
        const paymentIntent = yield stripe.paymentIntents.create({
            currency: "usd",
            amount: parseInt(amount),
            payment_method_types: ["card"],
        });
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.CREATED,
            data: {
                client_secret: paymentIntent.client_secret,
            },
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const newSubscribe = (0, asyncError_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _o, _p;
    try {
        const { name, email, paymentMethod, amount } = req.body;
        // Create a customer
        const customer = yield stripe.customers.create({
            email,
            name,
            payment_method: paymentMethod,
            invoice_settings: { default_payment_method: paymentMethod },
        });
        // Create a product
        const product = yield stripe.products.create({
            name: "Your Product Name",
        });
        // Create a subscription
        const subscription = yield stripe.subscriptions.create({
            customer: customer.id,
            items: [
                {
                    price_data: {
                        currency: "USD",
                        product: product.id,
                        unit_amount: amount,
                        recurring: {
                            interval: "year",
                        },
                    },
                },
            ],
            payment_settings: {
                payment_method_types: ["card"],
                save_default_payment_method: "on_subscription",
            },
            expand: ["latest_invoice.payment_intent"],
        });
        const clientSecret = (_p = (_o = subscription === null || subscription === void 0 ? void 0 : subscription.latest_invoice) === null || _o === void 0 ? void 0 : _o.payment_intent) === null || _p === void 0 ? void 0 : _p.client_secret;
        if (!clientSecret) {
            throw new Error("Client secret not found in the subscription");
        }
        const subscriptionId = subscription.id;
        res.json({
            message: "Subscription successfully initiated ssss",
            clientSecret,
            customer: customer.id,
            subscriptionId,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const unsubscribe = (0, asyncError_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { subscriptionId } = req.body;
    try {
        const canceledSubscription = yield stripe.subscriptions.cancel(subscriptionId);
        if (canceledSubscription.status === 'canceled') {
            res.json({ message: "Unsubscription successful", canceledSubscription });
            yield order_model_1.default.updateOne({ subscription_id: subscriptionId }, {
                $set: {
                    subscription_status: "inactive"
                }
            });
        }
        else {
            res.status(400).json({ error: "Subscription cancellation failed" });
        }
    }
    catch (error) {
        console.error("Error unsubscribing:", error);
        res.status(500).json({ error: "Server error" });
    }
}));
const getInvoiceById = (0, asyncError_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _q;
    try {
        const orderId = (_q = req === null || req === void 0 ? void 0 : req.params) === null || _q === void 0 ? void 0 : _q.id;
        if (!orderId)
            return next(new ErrorHandler_1.default("order id required", http_status_1.default.BAD_REQUEST));
        const order = yield order_model_1.default.findById(orderId).select("name packages delivery_info.address delivery_info.phone contact_email createdAt products order_type subscription_id transaction_id subscription_status");
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            data: order
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
// only admin 
const getSingleOrder = (0, asyncError_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _r;
    try {
        const orderId = (_r = req === null || req === void 0 ? void 0 : req.params) === null || _r === void 0 ? void 0 : _r.id;
        if (!orderId)
            return next(new ErrorHandler_1.default("order id required", http_status_1.default.BAD_REQUEST));
        const order = yield order_model_1.default.findById(orderId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            data: order
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const orderController = {
    createOrder,
    updateOrderStatus,
    deleteOrder,
    getOrders,
    searchOrders,
    getOrdersByEmail,
    newPayment,
    newSubscribe,
    unsubscribe,
    getInvoiceById,
    getSingleOrder,
};
exports.default = orderController;
