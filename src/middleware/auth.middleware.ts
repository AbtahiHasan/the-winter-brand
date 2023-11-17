
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import catchAsync from "./asyncError.middleware";
import ErrorHandler from "../utils/ErrorHandler";

import httpStatus from "http-status"
import config from "../config";
import { nodeCache } from "../app";

export const isAuthenticated = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const access_token: string | undefined = req.headers?.authorization


    if (!access_token) {
        return next(new ErrorHandler("Please login", httpStatus.BAD_REQUEST))
    }

    const decoded = jwt.verify(access_token, config.jwt.secret as string) as JwtPayload
    if (!decoded) {
        return next(new ErrorHandler("access token is not valid", httpStatus.BAD_REQUEST))
    }

    const chachedUser = nodeCache.get("user:" + decoded.email)

    if (!chachedUser) {
        return next(new ErrorHandler("user not found", httpStatus.BAD_REQUEST))
    }

    const user = JSON.parse(chachedUser as string)



    req.user = user
    next()
})


export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user?.role || "")) {
            return next(new ErrorHandler(`Role: ${req.user?.role} is not allowed`, httpStatus.BAD_REQUEST))
        }
        next()
    }
}