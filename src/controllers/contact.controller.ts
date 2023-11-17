import { NextFunction, Request, Response } from "express"
import catchAsync from "../middleware/asyncError.middleware"
import ErrorHandler from "../utils/ErrorHandler"
import httpStatus from "http-status"
import contactModel, { IContact } from "../models/contact.model"
import sendResponse from "../utils/sendResponse"

const createContact = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const contactData = req.body as IContact
        if (contactData?.need) {
            const isValidDate = new Date(contactData?.need) > new Date()
            if (!isValidDate) return next(new ErrorHandler("please enter valid date not past date", httpStatus.BAD_REQUEST))
        }

        const newContact = {
            name: contactData.name,
            email: contactData.email,
            need: contactData.need,
            message: contactData.message
        }

        await contactModel.create(newContact)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "contact added successfully"
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})
const getAllContacts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        let skip: number = parseInt((req?.query?.skip || "0") as string)
        let limit: number = parseInt((req?.query?.limit || "20") as string)


        const contacts = await contactModel.find().skip(skip).limit(limit)
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            data: contacts
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})

const contactController = {
    createContact,
    getAllContacts
}

export default contactController