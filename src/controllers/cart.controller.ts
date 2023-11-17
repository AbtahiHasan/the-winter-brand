import { NextFunction, Request, Response } from "express"
import catchAsync from "../middleware/asyncError.middleware"
import ErrorHandler from "../utils/ErrorHandler"
import httpStatus from "http-status"
import contactModel, { IContact } from "../models/contact.model"
import sendResponse from "../utils/sendResponse"
import cartModel, { ICart } from "../models/cart.model"
import productModel from "../models/product.model"

const createCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cartData = req.body as ICart
        if (!cartData?.product_id) return next(new ErrorHandler("product id is required", httpStatus.BAD_REQUEST))
        const product = await productModel.findById(cartData?.product_id)
        if (!product) return next(new ErrorHandler("product not found", httpStatus.BAD_REQUEST))
        const newCart = {
            product_name: cartData.product_name,
            product_id: cartData.product_id,
            price: cartData.price,
            product_image: cartData.product_image,
            email: cartData.email,
            product_quantity: product.quantity
        }
        console.log(24, newCart)

        await cartModel.create(newCart)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "cart added successfully"
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})





const updateCartQuantity = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body
        if (!data?.id || !data?.type) return next(new ErrorHandler("id and quantity update type is required", httpStatus.BAD_REQUEST))

        const type = data.type === "inc" ? 1 : -1
        await cartModel.findByIdAndUpdate(data.id, {
            $inc: {
                quantity: type
            }
        })


        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "cart quantity update successfully"
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})

const getCartByEmail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.params?.email
        if (!email) return next(new ErrorHandler("email is required", httpStatus.BAD_REQUEST))

        const carts = await cartModel.find({ email })

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            data: carts
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})
const getIsCartExistByEmail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, id } = req.query
        if (!email || !id) return next(new ErrorHandler("email and id is required", httpStatus.BAD_REQUEST))

        const cart = await cartModel.findOne({ email: email, product_id: id })
        if (cart) {
            return sendResponse(res, {
                success: false,
                statusCode: httpStatus.OK,
            })
        } else {
            return sendResponse(res, {
                success: true,
                statusCode: httpStatus.OK,
            })
        }

    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})



const deleteCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params?.id
        if (!id) return next(new ErrorHandler("id is required", httpStatus.BAD_REQUEST))

        await cartModel.findByIdAndDelete(id)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "cart deleted successfully"
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})


const cartController = {
    createCart,
    updateCartQuantity,
    getCartByEmail,
    getIsCartExistByEmail,
    deleteCart
}

export default cartController