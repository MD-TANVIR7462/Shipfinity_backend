import { NextFunction, Request, Response } from 'express';
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/authentication/auth.interface';
import { UserModel } from '../modules/authentication/auth.model';
import catchAsync from '../utils/catchAsync';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req?.headers?.authorization?.split(' ')[1];

    if (!token) {
      throw new JsonWebTokenError('Unauthorized Access!');
    }

    // checking token is valid or not
    let decodedUser: JwtPayload | string;

    try {
      decodedUser = jwt.verify(
        token as string,
        config.jwt_access_secret as string,
      ) as JwtPayload;
    } catch (error) {
      throw new JsonWebTokenError('Unauthorized Access!');
    }

    const { role, email } = decodedUser as JwtPayload;

    // checking if the user exist
    const user = await UserModel.isUserExistsWithEmail(email);

    if (!user) {
      throw new JsonWebTokenError('Unauthorized Access!');
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new JsonWebTokenError('Unauthorized Access!');
    }

    req.shopkeeper = decodedUser as JwtPayload & { role: string };
    next();
  });
};

export default auth;
