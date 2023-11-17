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
const ProductSchema = new mongoose_1.Schema({
    product_name: {
        type: String,
        required: [true, "Product name is required"]
    },
    product_description: {
        type: String,
        required: [true, "Product description is required"]
    },
    product_status: {
        type: String,
        default: "in stock",
        enum: ["in stock", "out of stock"]
    },
    price: {
        type: Number,
        required: [true, "Product price is required"]
    },
    regular_price: {
        type: Number,
    },
    discount: {
        type: Number,
        default: null
    },
    product_image: {
        type: String,
        required: [true, "Product image is required"]
    },
    already_sell: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        required: [true, "Product cart is required"]
    }
}, { timestamps: true });
const productModel = mongoose_1.default.model("product", ProductSchema);
exports.default = productModel;
