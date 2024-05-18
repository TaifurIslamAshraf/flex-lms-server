import httpStatus from "http-status";
import ApiError from "../../../errorHandlers/ApiError";
import { deleteFile } from "../../../helper/deleteFile";
import { IUser } from "../auth/auth.interface";
import { IUserUpdate } from "./user.interface";
import UserModel from "./user.model";

const updateUserAvatarIntodb = async (
  payload: Express.Multer.File | undefined,
  userId: string
): Promise<IUser> => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (!payload) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Image is required");
  } else {
    await deleteFile(user?.avatar as string);
  }

  if (user && !user.avatar) {
    user.avatar = "";
  }

  if (user && payload?.path) {
    user.avatar = payload.path;
  }

  await user?.save();

  return user;
};

const updateUserIntodb = async (payload: IUserUpdate, userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const updateFields = Object.entries(payload).reduce(
    (acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }

      return acc;
    },
    {} as Record<string, unknown>
  );

  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { $set: updateFields },
    { new: true }
  );

  return updatedUser;
};

export const userService = { updateUserAvatarIntodb, updateUserIntodb };
