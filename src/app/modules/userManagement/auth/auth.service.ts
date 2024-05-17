import httpStatus from "http-status";
import ApiError from "../../../errorHandlers/ApiError";
import UserModel from "../user/user.model";
import { ILogin, IUser, IUserSubset } from "./auth.interface";

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

export const authServices = { createUserIntodb, loginService };
