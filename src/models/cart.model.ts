import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICart extends Document {
    product_name: string;
    product_id: string;
    price: number;
    quantity: number;
    product_image: string;
    email: string;
    product_quantity?: number;
}

const CartSchema = new Schema<ICart>({
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

})

const cartModel: Model<ICart> = mongoose.model("cart", CartSchema)

export default cartModel