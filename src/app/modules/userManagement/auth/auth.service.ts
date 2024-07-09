import httpStatus from "http-status";
import ApiError from "../../../errorHandlers/ApiError";
import UserModel from "../user/user.model";
import { IActivation, ILogin, IUser, IUserSubset } from "./auth.interface";

import ejs from "ejs";
import path from "path";
import config from "../../../config/config";
import { jwtHelper } from "../../../helper/jwt.helper";
import { sendMails } from "../../../helper/sendMail";
import { logger } from "../../../utilities/logger";

const registerService = async (payload: IUserSubset): Promise<string> => {
  //is Email exist
  const user = await UserModel.exists({ email: payload.email });
  if (user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Alredy exist");
  }

  const { token, activationCode } = createActivationToken(payload);

  const data = {
    user: { name: payload.name },
    activationCode: activationCode,
  };

  await ejs.renderFile(path.join(__dirname, "../../../views/mail.ejs"), data);
  try {
    await sendMails({
      email: payload.email,
      subject: "Activate your account",
      templete: "mail.ejs",
      data,
    });
  } catch (error) {
    logger.error(error);
  }

  return token;
};

export const activationUserService = async (
  newUser: IUserSubset
): Promise<IUser> => {
  const isEmailExist = await UserModel.exists({ email: newUser?.email });

  if (isEmailExist) {
    throw new ApiError(400, "Email Alredy Exist");
  }

  const user = await UserModel.create(newUser);

  return user;
};

//login service
const loginService = async (payload: ILogin) => {
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

  if (!user) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You dont have account with this email"
    );
  }

  const userId = user._id;

  const serverUrl = config.serverUrl;

  const forgotPasswordToken = jwtHelper.createToken(
    { _id: userId },
    config.token_data.forgotPasswordJwtSecret!,
    "5m"
  );

  const forgotPasswordLink = `${serverUrl}/api/v1/auth/forgot-password-link-validation/${userId}/${forgotPasswordToken}`;

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
const userFindById = async (id: string) => {
  const result = await UserModel.findById(id);

  return result;
};

export const createActivationToken = (user: IUserSubset): IActivation => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwtHelper.createToken(
    { user, activationCode },
    config.token_data.mailVarificationSecret,
    "5m"
  );

  return { activationCode, token };
};

export const authServices = {
  registerService,
  activationUserService,
  loginService,
  userFindById,
  updatePasswordService,
  forgotPasswordService,
  resetPasswordService,
};
