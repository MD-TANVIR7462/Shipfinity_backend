/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import config from '../config';
import AppError from '../errors/AppError';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';
import handleValidationError from '../errors/handleValidationError';
import handleZodError from '../errors/handleZodError';
import { TErrorSources } from '../interface/error';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // default variables
  let errorSources: TErrorSources = [
    {
      path: '',
      message: '',
    },
  ];
  let statusCode = 500;
  let message = 'Something went wrong on the server !';
  let errorMessage = '';
  let errorDetails = err;

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
    let generatedErrorMessage = errorSources.map((errorSource) => {
      return `${errorSource.path} ${errorSource.message}`;
    });
    errorMessage = generatedErrorMessage.join(', ');
  } else if (err?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
    let generatedErrorMessage = errorSources.map((errorSource) => {
      return `${errorSource.path} ${errorSource.message}`;
    });
    errorMessage = generatedErrorMessage.join(', ');
  } else if (err?.name === 'CastError') {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
    let generatedErrorMessage = errorSources.map((errorSource) => {
      return `${errorSource.path} ${errorSource.message}`;
    });
    errorMessage = generatedErrorMessage.join(', ');
  } else if (
    err?.name === 'TokenExpiredError' ||
    err?.name === 'JsonWebTokenError' ||
    err?.name === 'NotBeforeError'
  ) {
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
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
    let generatedErrorMessage = errorSources.map((errorSource) => {
      return `${errorSource.path} ${errorSource.message}`;
    });
    errorMessage = generatedErrorMessage.join(', ');
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
    errorMessage = err?.message;
  } else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
    errorMessage = err?.message;
  }

  if (
    err?.name === 'TokenExpiredError' ||
    err?.name === 'JsonWebTokenError' ||
    err?.name === 'NotBeforeError'
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      errorMessage,
      errorDetails: null,
      stack: null,
    });
  }

  if (
    message === 'Current password does not match' ||
    message === 'New password must be different from the current password' ||
    message ===
      'New password must be minimum 6 characters and include both letters and numbers' ||
    message.split(' ').slice(0, 1).join(' ') === 'Password'
  ) {
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
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;
