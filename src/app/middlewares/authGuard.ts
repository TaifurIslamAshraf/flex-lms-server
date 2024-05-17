import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import config from "../config/config";
import ApiError from "../errorHandlers/ApiError";
import UserModel from "../modules/userManagement/user/user.model";
import catchAsync from "../utilities/catchAsync";

import { NextFunction, Request, Response } from "express";
import { jwtHelper } from "../helper/jwt.helper";

export const isAuthenticated = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refresh_token = req.cookies.refresh_token as string;

    if (!refresh_token) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Please login to access this recourse"
      );
    }
    const decoded = jwtHelper.verifyToken(
      refresh_token,
      config.token_data.refresh_token_secret!
    ) as JwtPayload;

    if (!decoded) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Invalid access token. please login"
      );
    }

    const user = await UserModel.findById(decoded._id);

    if (!user) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Please login to access this recourse"
      );
    }

    res.locals.user = user;

    next();
  }
);

export const authorizeUser = (...roles: string[]) => {
  return catchAsync(async (req, res, next) => {
    if (!roles.includes(res.locals.user.role)) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        `${res.locals.user.role} is not allowed to access this recourse`
      );
    }

    next();
  });
};

export default { authorizeUser, isAuthenticated };
