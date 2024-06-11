import { Request, Response } from "express";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import config from "../../../config/config";
import ApiError from "../../../errorHandlers/ApiError";
import { jwtHelper } from "../../../helper/jwt.helper";
import { extractTokenFromHeader } from "../../../middlewares/authGuard";
import catchAsync from "../../../utilities/catchAsync";
import sendResponse from "../../../utilities/sendResponse";
import { IUser } from "./auth.interface";
import { authServices } from "./auth.service";
import { sendToken } from "./auth.utils";

//register user
const registerUser = catchAsync(async (req: Request, res: Response) => {
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
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await authServices.loginService({ email, password });

  sendToken(result!, 200, res);
});

//logout user
const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Logout successfull",
  });
});

//update access token
const updateAccessToken = catchAsync(async (req: Request, res: Response) => {
  const refresh_token = extractTokenFromHeader(req, "Refresh") as string;

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
  // res.cookie("access_token", accessToken, accessTokenCookieOptions);
  // res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: { accessToken, refreshToken },
  });
});

//update passowrd
const updatePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = res.locals.user._id;

  const payload = {
    oldPassword,
    newPassword,
  };

  await authServices.updatePasswordService(payload, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Password update successfully",
  });
});

//forgot password
const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email is required");
  }

  await authServices.forgotPasswordService(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Check you email",
  });
});

const forgotPasswordLinkValidation = catchAsync(async (req, res) => {
  const { userId, token } = req.params;
  if (!userId || !token) {
    res.status(400).send("<h1>Invalid Link. try again</h1>");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).send("<h1>Invalid Link. try again</h1>");
  }

  const decoded = jwtHelper.verifyToken(
    token,
    config.token_data.forgotPasswordJwtSecret!
  );
  if (!decoded) {
    res.status(400).send("<h1>Invalid Link. try again</h1>");
  }

  res.redirect(
    `${config.clientSideURL?.split(",")[0]}/resetPassword/${userId}/${token}`
  );
});

const resetPassword = catchAsync(async (req, res) => {
  const { newPassword, token, userId } = req.body;

  await authServices.resetPasswordService({ newPassword, token, userId });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Reset password successfully. please login",
  });
});

export const authControllers = {
  registerUser,
  loginUser,
  logout,
  updateAccessToken,
  updatePassword,
  forgotPassword,
  forgotPasswordLinkValidation,
  resetPassword,
};
