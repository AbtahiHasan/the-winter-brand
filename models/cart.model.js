"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const CartSchema = new mongoose_1.Schema({
    product_name: {
        type: String,
        required: [true, "product name is required"]
    },
    product_id: {
        type: String,
        required: [true, "product id is required"]
    },
    price: {
        type: Number,
        required: [true, "price name is required"]
    },
    quantity: {
        type: Number,
        default: 1
    },
    product_image: {
        type: String,
        required: [true, "product image name is required"]
    },
    email: {
        type: String,
        required: [true, "email name is required"]
    },
    product_quantity: {
        type: Number,
        required: [true, "Product Quantity is required"]
    }
});
const cartModel = mongoose_1.default.model("cart", CartSchema);
exports.default = cartModel;
