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
const OrderSchema = new mongoose_1.Schema({
    order_type: {
        type: String,
        required: [true, "order type is required"],
        enum: ["payment", "subscription", "cart"]
    },
    name: {
        type: String,
        required: [true, "name is required"]
    },
    products: [
        {
            id: {
                type: String
            },
            product_name: {
                type: String
            },
            quantity: {
                type: Number
            },
            price: {
                type: Number
            },
        }
    ],
    order_status: {
        type: String,
        default: "pending",
        enum: ["pending", "completed", "returned", "canceled"]
    },
    transaction_id: {
        type: String,
    },
    subscription_id: {
        type: String,
    },
    subscription_status: {
        type: String,
    },
    company: {
        type: String,
        default: null
    },
    contact_email: {
        type: String,
        required: [true, "contact email is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"]
    },
    packages: {
        type: {
            type: String,
        },
        gender: {
            type: String,
        },
        size: {
            type: String,
        },
        selected: {
            type: Array,
        },
        package: {
            type: String,
        },
        price: {
            type: Number,
        },
        gift: {
            gift_message: {
                type: String,
            },
            gift_recipient_email: {
                type: String,
            },
            gift_message_date: {
                type: Date
            },
            shipping_date: {
                type: Date
            }
        }
    },
    delivery_info: {
        country: {
            type: String,
            required: [true, "country is required"],
        },
        state: {
            type: String,
            required: [true, "state is required"],
        },
        address: {
            type: String,
            required: [true, "address is required"],
        },
        postcode: {
            type: String,
            required: [true, "postcode is required"],
        },
        city: {
            type: String,
            required: [true, "city is required"],
        },
        phone: {
            type: String,
            required: [true, "phone is required"],
        },
        apartment: {
            type: String
        },
    },
    user_review: {
        rating: {
            type: String,
        },
        name: {
            type: String,
        },
        review: {
            type: String,
        }
    },
    promotions: {
        phone_number: {
            type: String,
        },
        email: {
            type: String,
        },
    }
}, { timestamps: true });
const orderModel = mongoose_1.default.model("order", OrderSchema);
exports.default = orderModel;
