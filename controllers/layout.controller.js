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
const layout_model_1 = __importDefault(require("../models/layout.model"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const mongodb_1 = require("mongodb");
const createLayout = (0, asyncError_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.body;
        const typeAlredyExits = yield layout_model_1.default.findOne({ type });
        if (typeAlredyExits) {
            if (type === "FAQ") {
                const { faq } = req.body;
                const updatedFaqs = [
                    ...typeAlredyExits.faqs,
                    Object.assign({}, faq)
                ];
                yield layout_model_1.default.findByIdAndUpdate(typeAlredyExits._id, { faqs: updatedFaqs });
            }
            else if (type === "FEATURED_IMAGE") {
                const { image_url } = req.body;
                const updatedImages = [
                    ...typeAlredyExits.featured_images,
                    { image_url }
                ];
                yield layout_model_1.default.findByIdAndUpdate(typeAlredyExits._id, { featured_images: updatedImages });
            }
        }
        else {
            if (type === "FAQ") {
                const { faq } = req.body;
                yield layout_model_1.default.create({ type: "FAQ", faqs: Object.assign({}, faq) });
            }
            else if (type === "FEATURED_IMAGE") {
                const { image_url } = req.body;
                yield layout_model_1.default.create({ type: "FEATURED_IMAGE", featured_images: { image_url } });
            }
            else {
                return next(new ErrorHandler_1.default(`${type} is not valid type`, 400));
            }
        }
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.CREATED,
            message: "Layout added successfully"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
const updateFeaturedImage = (0, asyncError_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, isChecked } = req.body;
        if (!_id || !isChecked.toString())
            return next(new ErrorHandler_1.default("_id, isChecked  this fields is required", http_status_1.default.BAD_REQUEST));
        const typeAlredyExits = yield layout_model_1.default.updateOne({ featured_images: { $elemMatch: { _id: new mongodb_1.ObjectId(_id) } } }, { $set: { "featured_images.$.isChecked": isChecked } });
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.CREATED,
            message: "image isChecked successfully"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
const deleteLayout = (0, asyncError_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, id } = req.query;
        if (!type || !id)
            return next(new ErrorHandler_1.default("type and id required", http_status_1.default.BAD_REQUEST));
        const typeAlredyExits = yield layout_model_1.default.findOne({ type });
        if (typeAlredyExits) {
            if (type === "FAQ") {
                const filterDeleteFaq = typeAlredyExits.faqs.filter(faq => faq._id.toString() !== id);
                yield layout_model_1.default.findByIdAndUpdate(typeAlredyExits._id, { faqs: filterDeleteFaq });
            }
            else if (type === "FEATURED_IMAGE") {
                const filterDeleteFeaturedImages = typeAlredyExits.featured_images.filter(image => image._id.toString() !== id);
                yield layout_model_1.default.findByIdAndUpdate(typeAlredyExits._id, { featured_images: filterDeleteFeaturedImages });
            }
        }
        else {
            return next(new ErrorHandler_1.default(`${type} is not valid type`, 400));
        }
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.CREATED,
            message: `${type} Layout deleted successfully`
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
const deleteMultipleFeaturedImages = (0, asyncError_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { images_id } = req.body;
        console.log(images_id);
        if (!images_id)
            return next(new ErrorHandler_1.default("images id required", http_status_1.default.BAD_REQUEST));
        const typeAlredyExits = yield layout_model_1.default.findOne({ type: "FEATURED_IMAGE" });
        if (typeAlredyExits) {
            const filterDeleteFeaturedImages = typeAlredyExits.featured_images.filter(image => !images_id.includes(image._id.toString()));
            yield layout_model_1.default.findByIdAndUpdate(typeAlredyExits._id, { featured_images: filterDeleteFeaturedImages });
        }
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.CREATED,
            message: `FEATURED IMAGE Layout deleted successfully`
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
const getFaqs = (0, asyncError_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield layout_model_1.default.findOne({ type: "FAQ" });
        if (data) {
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_1.default.OK,
                data: data.faqs
            });
        }
        else {
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_1.default.OK,
                data: []
            });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
const getFeaturedImage = (0, asyncError_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield layout_model_1.default.findOne({ type: "FEATURED_IMAGE" });
        if (data) {
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_1.default.OK,
                data: data.featured_images
            });
        }
        else {
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_1.default.OK,
                data: []
            });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
const layoutController = {
    createLayout,
    updateFeaturedImage,
    deleteLayout,
    deleteMultipleFeaturedImages,
    getFaqs,
    getFeaturedImage
};
exports.default = layoutController;
