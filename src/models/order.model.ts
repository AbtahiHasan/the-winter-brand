import mongoose, { Document, Model, Schema } from "mongoose";

interface IProduct {
    id?: string;
    product_name?: string;
    quantity?: number;
    price?: number;
}

export interface IOrder extends Document {
    order_type: "payment" | "subscription" | "cart",
    name: string;
    products?: IProduct[];
    order_status: string;
    transaction_id?: string;
    subscription_id?: string;
    company?: string;
    contact_email: string;
    email: string;
    packages?: {
        type?: "personal" | "gift";
        gender?: "male" | "female";
        size?: "Adult" | "Kid's";
        selected?: string[];
        package?: string;
        price: number;
        gift: {
            gift_message: string;
            gift_recipient_email: string;
            gift_message_date: Date,
            shipping_date: Date;
        }
    };
    delivery_info: {
        country: string;
        state: string;
        address: string;
        postcode: number;
        city: string;
        phone: string;
        apartment?: string;
    },
    user_review: {
        rating: number;
        name: string;
        review: string;
    }
    promotions?: {
        phone_number?: string;
        email?: string;
    }
}


const OrderSchema = new Schema<IOrder>({
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
}, { timestamps: true })

const orderModel: Model<IOrder> = mongoose.model("order", OrderSchema)

export default orderModel