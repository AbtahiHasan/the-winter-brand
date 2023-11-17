import { NextFunction, Request, Response } from "express"
import catchAsync from "../middleware/asyncError.middleware"
import httpStatus from "http-status"
import ErrorHandler from "../utils/ErrorHandler"
import sendResponse from "../utils/sendResponse"
import userModel from "../models/user.model"
import orderModel from "../models/order.model"
import contactModel from "../models/contact.model"


const getTotalCreatedData = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const totalUser = await userModel.estimatedDocumentCount()
        const totalOrder = await orderModel.estimatedDocumentCount()
        const totalReviews = await orderModel.find({ user_review: { $exists: true } }).countDocuments()
        const totalContacts = await contactModel.estimatedDocumentCount()
        const analytics = {
            users: totalUser,
            orders: totalOrder,
            reviews: totalReviews,
            contacts: totalContacts

        }
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            data: analytics
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})
const getRecentOrdersReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const reviews = await orderModel.find({ user_review: { $exists: true } }).select("user_review email createdAt").sort({ createdAt: -1 }).limit(10)
        const orders = await orderModel.find().sort({ createdAt: -1 }).select("name  transaction_id subscription_id  order_status contact_email createdAt").limit(10)

        const analytics = {
            reviews,
            orders
        }
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            data: analytics
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})


const analyticsController = {
    getTotalCreatedData,
    getRecentOrdersReviews

}

export default analyticsController