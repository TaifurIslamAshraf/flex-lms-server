import httpStatus from "http-status";
import ApiError from "../../../errorHandlers/ApiError";
import { IUser, IUserSubset } from "./user.interface";
import UserModel from "./user.model";

const createUserIntodb = async (payload: IUserSubset): Promise<IUser> => {
  //is Email exist
  const user = await UserModel.exists({ email: payload.email });
  if (user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Alredy exist");
  }

  const result = await UserModel.create(payload);

  return result;
};

export const userServices = { createUserIntodb };
