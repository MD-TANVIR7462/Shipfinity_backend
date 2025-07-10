"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const handleCastError_1 = __importDefault(require("../errors/handleCastError"));
const handleDuplicateError_1 = __importDefault(require("../errors/handleDuplicateError"));
const handleValidationError_1 = __importDefault(require("../errors/handleValidationError"));
const handleZodError_1 = __importDefault(require("../errors/handleZodError"));
const globalErrorHandler = (err, req, res, next) => {
    // default variables
    let errorSources = [
        {
            path: '',
            message: '',
        },
    ];
    let statusCode = 500;
    let message = 'Something went wrong on the server !';
    let errorMessage = '';
    let errorDetails = err;
    if (err instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.default)(err);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorSources = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
        let generatedErrorMessage = errorSources.map((errorSource) => {
            return `${errorSource.path} ${errorSource.message}`;
        });
        errorMessage = generatedErrorMessage.join(', ');
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === 'ValidationError') {
        const simplifiedError = (0, handleValidationError_1.default)(err);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorSources = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
        let generatedErrorMessage = errorSources.map((errorSource) => {
            return `${errorSource.path} ${errorSource.message}`;
        });
        errorMessage = generatedErrorMessage.join(', ');
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === 'CastError') {
        const simplifiedError = (0, handleCastError_1.default)(err);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorSources = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
        let generatedErrorMessage = errorSources.map((errorSource) => {
            return `${errorSource.path} ${errorSource.message}`;
        });
        errorMessage = generatedErrorMessage.join(', ');
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === 'TokenExpiredError' ||
        (err === null || err === void 0 ? void 0 : err.name) === 'JsonWebTokenError' ||
        (err === null || err === void 0 ? void 0 : err.name) === 'NotBeforeError') {
        statusCode = 401;
        message = 'Unauthorized Access !';
        errorSources = [
            {
                path: '',
                message: '',
            },
        ];
        errorMessage =
            'You do not have the necessary permissions to access this resource.';
    }
    else if ((err === null || err === void 0 ? void 0 : err.code) === 11000) {
        const simplifiedError = (0, handleDuplicateError_1.default)(err);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorSources = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
        let generatedErrorMessage = errorSources.map((errorSource) => {
            return `${errorSource.path} ${errorSource.message}`;
        });
        errorMessage = generatedErrorMessage.join(', ');
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err === null || err === void 0 ? void 0 : err.statusCode;
        message = err.message;
        errorSources = [
            {
                path: '',
                message: err === null || err === void 0 ? void 0 : err.message,
            },
        ];
        errorMessage = err === null || err === void 0 ? void 0 : err.message;
    }
    else if (err instanceof Error) {
        message = err.message;
        errorSources = [
            {
                path: '',
                message: err === null || err === void 0 ? void 0 : err.message,
            },
        ];
        errorMessage = err === null || err === void 0 ? void 0 : err.message;
    }
    if ((err === null || err === void 0 ? void 0 : err.name) === 'TokenExpiredError' ||
        (err === null || err === void 0 ? void 0 : err.name) === 'JsonWebTokenError' ||
        (err === null || err === void 0 ? void 0 : err.name) === 'NotBeforeError') {
        return res.status(statusCode).json({
            success: false,
            message,
            errorMessage,
            errorDetails: null,
            stack: null,
        });
    }
    if (message === 'Current password does not match' ||
        message === 'New password must be different from the current password' ||
        message ===
            'New password must be minimum 6 characters and include both letters and numbers' ||
        message.split(' ').slice(0, 1).join(' ') === 'Password') {
        return res.status(statusCode).json({
            success: false,
            statusCode,
            message,
            data: null,
        });
    }
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errorMessage,
        errorDetails,
        stack: config_1.default.NODE_ENV === 'development' ? err === null || err === void 0 ? void 0 : err.stack : null,
    });
};
exports.default = globalErrorHandler;
