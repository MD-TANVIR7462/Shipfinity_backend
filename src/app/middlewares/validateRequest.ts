import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;

    try {
      await schema.parseAsync(data);
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default validateRequest;
