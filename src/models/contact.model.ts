import mongoose, { Document, Model, Schema } from "mongoose";

export interface IContact extends Document {
    name: string;
    email: string;
    need: Date;
    message: string;
}


const contactSchema = new Schema<IContact>({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    need: {
        type: Date,
        required: [true, "Time is required"]
    },
    message: {
        type: String,
        required: [true, "message is required"]
    },
}, { timestamps: true })


const contactModel: Model<IContact> = mongoose.model("contact", contactSchema)

export default contactModel