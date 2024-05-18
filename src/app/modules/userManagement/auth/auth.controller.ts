import { Request, Response } from "express";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import config from "../../../config/config";
import ApiError from "../../../errorHandlers/ApiError";
import { jwtHelper } from "../../../helper/jwt.helper";
import catchAsync from "../../../utilities/catchAsync";
import sendResponse from "../../../utilities/sendResponse";
import { IUser } from "./auth.interface";
import { authServices } from "./auth.service";
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
  sendToken,
} from "./auth.utils";

//register user
export const registerUser = catchAsync(async (req: Request, res: Response) => {
  //get user data form body
  const { name, email, password, phone } = req.body as IUser;

  const payload = {
    name,
    email,
    password,
    phone,
  };

  const result = await authServices.createUserIntodb(payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "user create successfully",
    data: result,
  });
});

//login user
export const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await authServices.loginService({ email, password });

  sendToken(result, 200, res);
});

//logout user
export const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Logout successfull",
  });
});

//update access token
export const updateAccessToken = catchAsync(
  async (req: Request, res: Response) => {
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
        "Please login to access this recourse"
      );
    }

    const userId = decoded._id;

    const user = await authServices.userFindById(userId);

    if (!user) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Please login to access this recourse"
      );
    }

    const accessToken = jwtHelper.createToken(
      { _id: userId },
      config.token_data.access_token_secret!,
      config.token_data.access_token_expires!
    );
    const refreshToken = jwtHelper.createToken(
      { _id: userId },
      config.token_data.refresh_token_secret!,
      config.token_data.refresh_token_expires!
    );

    res.locals.user = user;
    res.cookie("access_token", accessToken, accessTokenCookieOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      data: accessToken,
    });
  }
);
