import httpStatus from "http-status";
import ApiError from "../../../errorHandlers/ApiError";
import UserModel from "../user/user.model";
import { ILogin, IUser, IUserSubset } from "./auth.interface";

import ejs from "ejs";
import path from "path";
import config from "../../../config/config";
import { jwtHelper } from "../../../helper/jwt.helper";
import { sendMails } from "../../../helper/sendMail";

const createUserIntodb = async (payload: IUserSubset): Promise<IUser> => {
  //is Email exist
  const user = await UserModel.exists({ email: payload.email });
  if (user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Alredy exist");
  }

  const result = await UserModel.create(payload);

  return result;
};

//login service
const loginService = async (payload: ILogin): Promise<IUser> => {
  const user = await UserModel.findOne({ email: payload.email }).select(
    "+password"
  );

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  const isPasswordMatch = await user?.comparePassword(payload.password);
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  const result = await UserModel.findOne({ email: payload.email });

  return result;
};

const updatePasswordService = async (
  payload: { oldPassword: string; newPassword: string },
  userId: string
) => {
  const user = await UserModel.findById(userId).select("+password");
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const isPasswordMatch = await user?.comparePassword(payload.oldPassword);
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invalid old password");
  }

  if (user?.password) {
    user.password = payload.newPassword;
  }

  await user?.save();
};

//forgot password service
const forgotPasswordService = async (email: string) => {
  const user = await UserModel.findOne({ email });
  const userId = user._id;

  if (!user) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You dont have account with this email"
    );
  }

  const serverUrl = config.serverUrl;

  const forgotPasswordToken = jwtHelper.createToken(
    { _id: userId },
    config.token_data.forgotPasswordJwtSecret!,
    "5m"
  );

  const forgotPasswordLink = `${serverUrl}/api/v1/user/forgot-password-link-validation/${userId}/${forgotPasswordToken}`;

  await ejs.renderFile(path.join(__dirname, "../../../views/forgotMail.ejs"), {
    forgotPasswordLink,
  });

  await sendMails({
    email: email,
    subject: "Reset Your MyShop password",
    templete: "forgotMail.ejs",
    data: { forgotPasswordLink },
  });
};

//reset password service
const resetPasswordService = async (payload: {
  newPassword: string;
  token: string;
  userId: string;
}) => {
  const user = await UserModel.findById(payload.userId).select("+password");
  if (!user) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You dont have account with this email"
    );
  }
  if (user?.isSocialAuth) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "you are not to able update password"
    );
  }

  const decoded = jwtHelper.verifyToken(
    payload.token,
    config.token_data.forgotPasswordJwtSecret!
  );
  if (!decoded) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Reset password link");
  }

  if (user?.password) {
    user.password = payload.newPassword;
  }

  await user?.save();
};

//user find by id
const userFindById = async (id: string): Promise<IUser> => {
  const result = await UserModel.findById(id);

  return result;
};

export const authServices = {
  createUserIntodb,
  loginService,
  userFindById,
  updatePasswordService,
  forgotPasswordService,
  resetPasswordService,
};
