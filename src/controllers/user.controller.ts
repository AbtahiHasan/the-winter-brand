import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload, Secret } from "jsonwebtoken"
import httpStatus from "http-status"
import catchAsync from "../middleware/asyncError.middleware"
import ErrorHandler from "../utils/ErrorHandler"
import sendResponse from "../utils/sendResponse"
import userModel, { IUser } from "../models/user.model"
import config from "../config"
import { nodeCache } from "../app"
import sendToken, { accessTokenOption, refreshTokenOption } from "../utils/jwt"

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.body as IUser
        const newUserData = {
            name: userData.name,
            email: userData.email,
        }

        await userModel.create(newUserData)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "user created successfully"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})

const updateUserProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.body as IUser
        if (!userData.email) return next(new ErrorHandler("id is required", httpStatus.BAD_REQUEST))
        const updatedUserData = {
            name: userData.name,
            avatar: userData.avatar,
            phone_number: userData.phone_number,
            location: userData.location,
            about: userData.about,
        }

        await userModel.updateOne({ email: userData.email }, {
            $set: updatedUserData
        }, { new: true })

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "user updated successfully"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})



const updateUserRole = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { role, id } = req.body
        console.log(role, id)
        if (!role || !id) return next(new ErrorHandler("id and role is required", httpStatus.BAD_REQUEST))

        await userModel.findByIdAndUpdate(id, {
            $set: {
                role: role
            }
        })
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "user updated successfully"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})
const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        let skip: number = parseInt((req?.query?.skip || "0") as string)
        let limit: number = parseInt((req?.query?.limit || "20") as string)
        const users = await userModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit)
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            data: users
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})

const searchUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = req?.params?.query
        if (!query) return next(new ErrorHandler("search query is required", httpStatus.BAD_REQUEST))
        let skip: number = parseInt((req?.query?.skip || "0") as string)
        let limit: number = parseInt((req?.query?.limit || "20") as string)
        const users = await userModel.find(
            {
                $or: [
                    { name: { $regex: query, $options: "i" } },
                    { email: { $regex: query, $options: "i" } }
                ]
            }
        ).sort({ createdAt: -1 }).skip(skip).limit(limit)
        // const users = await userModel.find()
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            data: users
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})
const getUserRole = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.params?.email as string

        if (!email) return next(new ErrorHandler("email is require in query", httpStatus.BAD_REQUEST))
        const isCachedUser = nodeCache.has(`user:${email}`)
        if (isCachedUser) {
            const cachedUser = nodeCache.get(`user:${email}`)
            const user = JSON.parse(cachedUser as string)
            return sendResponse(res, {
                success: true,
                statusCode: httpStatus.CREATED,
                data: {
                    role: user.role
                }
            })
        } else {
            const user = await userModel.findOne({ email })
            if (user) {
                nodeCache.set(`user:${user.email}`, JSON.stringify(user))
                return sendResponse(res, {
                    success: true,
                    statusCode: httpStatus.CREATED,
                    data: {
                        role: user.role
                    }
                })
            } else {
                return next(new ErrorHandler("invalid email", httpStatus.UNAUTHORIZED))
            }
        }

    } catch (error: any) {

        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})

const getProfileByEmail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.params?.email

        if (!email) return next(new ErrorHandler("email is required", httpStatus.BAD_REQUEST))
        const userInfo = await userModel.findOne({ email })
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            data: userInfo
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})




interface ILoginRequest {
    email: string;
}

const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body as ILoginRequest

        if (!email) {
            return next(new ErrorHandler("please enter email", httpStatus.BAD_REQUEST))
        }

        const user = await userModel.findOne({ email })


        if (!user) {
            return next(new ErrorHandler("Invalid email and password", httpStatus.BAD_REQUEST))
        }

        sendToken(user, httpStatus.OK, res)



    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.query?.email

        if (!email) return next(new ErrorHandler("email is require in query", httpStatus.BAD_REQUEST))
        nodeCache.del(`user:${email}`)
        res.cookie("access_token", "", { maxAge: 1 })
        res.cookie("refresh_token", "", { maxAge: 1 })
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "logout successfully"
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})






const userController = {
    createUser,
    updateUserProfile,
    updateUserRole,
    getAllUsers,
    searchUsers,
    getUserRole,
    getProfileByEmail,
    loginUser,
    logout
}

export default userController