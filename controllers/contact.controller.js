"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncError_middleware_1 = __importDefault(require("../middleware/asyncError.middleware"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const http_status_1 = __importDefault(require("http-status"));
const contact_model_1 = __importDefault(require("../models/contact.model"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const createContact = (0, asyncError_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contactData = req.body;
        if (contactData === null || contactData === void 0 ? void 0 : contactData.need) {
            const isValidDate = new Date(contactData === null || contactData === void 0 ? void 0 : contactData.need) > new Date();
            if (!isValidDate)
                return next(new ErrorHandler_1.default("please enter valid date not past date", http_status_1.default.BAD_REQUEST));
        }
        const newContact = {
            name: contactData.name,
            email: contactData.email,
            need: contactData.need,
            message: contactData.message
        };
        yield contact_model_1.default.create(newContact);
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.CREATED,
            message: "contact added successfully"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const getAllContacts = (0, asyncError_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let skip = parseInt((((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.skip) || "0"));
        let limit = parseInt((((_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.limit) || "20"));
        const contacts = yield contact_model_1.default.find().skip(skip).limit(limit);
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.OK,
            data: contacts
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const contactController = {
    createContact,
    getAllContacts
};
exports.default = contactController;
