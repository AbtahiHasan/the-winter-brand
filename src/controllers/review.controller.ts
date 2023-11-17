import { NextFunction, Response, Request } from "express"
import catchAsync from "../middleware/asyncError.middleware"
import ErrorHandler from "../utils/ErrorHandler"
import httpStatus from "http-status"

import sendResponse from "../utils/sendResponse"
import orderModel, { IOrder } from "../models/order.model"
// TODO  create order
const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const orderId = req?.body?.order_id

        if (!orderId) return next(new ErrorHandler("order id required", httpStatus.OK))
        const reviewData = req.body
        const order = await orderModel.findById(orderId)
        if (!order) return next(new ErrorHandler("Invalid order id", httpStatus.BAD_REQUEST))
        const newReview = {
            rating: reviewData.rating,
            name: reviewData.name,
            review: reviewData.review,
        }

        order.user_review = newReview

        await order?.save()


        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: 'review successfully added'
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})

const getReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        let skip: number = parseInt((req?.query?.skip || "0") as string)
        let limit: number = parseInt((req?.query?.limit || "20") as string)

        const reviews = await orderModel.find({ user_review: { $exists: true } }).select("user_review email").sort({ createdAt: -1 }).skip(skip).limit(limit)
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            data: reviews
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})




const reviewController = {
    createReview,
    getReviews,

}

export default reviewController