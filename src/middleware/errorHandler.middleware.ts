import { Request, Response, NextFunction } from "express"
import httpStatus from "http-status"
import ErrorHandler from "../utils/ErrorHandler"


const errorHandlerMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR
    err.message = err.message || "Internal server error"


    if (err.name === "CastError") {
        const message = `Resourse not found invalid ${err.path}`
        new ErrorHandler(message, httpStatus.BAD_REQUEST)
    }
    if (err.code === 11000) {
        const message = `Dublicate object keys ${Object.keys(err.keyValue)} entered`
        new ErrorHandler(message, httpStatus.BAD_REQUEST)
    }
    if (err.name === "JsonWebTokenError") {
        const message = `Json web token is invalid, try again`
        new ErrorHandler(message, httpStatus.BAD_REQUEST)
    }
    if (err.name === "TokenExpiredError") {
        const message = `json web token is expired, try again`
        new ErrorHandler(message, httpStatus.BAD_REQUEST)
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}

export default errorHandlerMiddleware