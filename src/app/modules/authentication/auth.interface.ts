/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type TLastPassword = {
  oldPassword: string;
  changedAt: Date;
};

export type TChangePasswordData = {
  currentPassword: string;
  newPassword: string;
};

export type TUser = {
  _id: string;
  name: string;
  email: string;
  isEmailVerified: string;
  password: string;
  role: 'admin' | 'vendor' | 'customer';
  lastTwoPasswords?: TLastPassword[];
  profileImage?: string;
  isBlocked: boolean;
  address?: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    mobile?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

export type TUserProfileDataToBeUpdated = {
  name?: string;
  profileImage?: string;
  isBlocked?: boolean;
  address?: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    mobile: string;
  };
};

export type TUserRole = 'admin' | 'vendor' | 'customer';

export type TDecodedUser = {
  _id: string;
  name: string;
  email: string;
  role: TUserRole;
  isBlocked: boolean;
  iat: number;
  exp: number;
};

//for creating statics
export interface TUserModel extends Model<TUser> {
  isUserExistsWithEmail(email: string): Promise<TUser | null>;
}




