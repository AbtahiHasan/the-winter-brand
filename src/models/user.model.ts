import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    avatar?: string;
    phone_number: string;
    location: string;
    about: string
    role?: string;
}


const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: [true, "Please enter your name"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true
    },
    avatar: {
        type: String,
    },
    phone_number: {
        type: String,
    },
    location: {
        type: String,
    },
    about: {
        type: String,
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin", "super_admin"]
    },
}, { timestamps: true })

const userModel: Model<IUser> = mongoose.model("user", userSchema)

export default userModel
