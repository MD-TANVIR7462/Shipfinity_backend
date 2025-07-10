"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleDuplicateError = (err) => {
    // getting the value that is duplicated
    const match = err.message.match(/"([^"]*)"/);
    const extractedMessage = match && match[1];
    const errorSources = [
        {
            path: '',
            message: `${extractedMessage} already exists`,
        },
    ];
    const statusCode = 409;
    return {
        statusCode,
        message: 'Duplicate Error',
        errorSources,
    };
};
exports.default = handleDuplicateError;
