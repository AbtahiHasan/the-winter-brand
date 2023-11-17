import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";

import sendResponse from "../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../middleware/asyncError.middleware";
import productModel, { IProduct } from "../models/product.model";


// only admin 
const createProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productData = req.body as IProduct
        let tempPrice = productData.price
        if (productData?.discount) {
            const subtract = productData?.discount / 100 * productData.price
            productData.price = productData.price - subtract
        }
        const newProduct = {
            product_name: productData.product_name,
            product_description: productData.product_description,
            price: productData.price,
            regular_price: productData?.discount ? tempPrice : null,
            discount: productData.discount || null,
            product_image: productData.product_image,
            quantity: productData.quantity,
        }
        await productModel.create(newProduct)
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "product created successfully"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})
// admin only 
const updateProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params?.id as string
        const productData = req.body as IProduct
        let tempPrice = productData.price
        if (productData?.discount) {
            const subtract = productData?.discount / 100 * productData.price
            productData.price = productData.price - subtract
        }
        const updatedProductData = {
            product_name: productData.product_name,
            product_description: productData.product_description,
            price: productData.price,
            regular_price: productData?.discount ? tempPrice : null,
            discount: productData.discount || null,
            product_image: productData.product_image,
            quantity: productData.quantity,
        }
        await productModel.findByIdAndUpdate(id, {
            $set: updatedProductData
        }, { new: true })
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "product updated successfully"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})


const deleteProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = req.params?.id
        await productModel.findByIdAndDelete(productId)
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "product deleted successfully"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})

const getProducts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        let skip: number = parseInt((req?.query?.skip || "0") as string)
        let limit: number = parseInt((req?.query?.limit || "20") as string)



        const products = await productModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit)

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            data: products
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})
const getProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params?.id
        if (!id) return next(new ErrorHandler("id is required", httpStatus.BAD_REQUEST))
        const product = await productModel.findById(id)
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            data: product
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})


const productController = {
    createProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getProduct
}

export default productController