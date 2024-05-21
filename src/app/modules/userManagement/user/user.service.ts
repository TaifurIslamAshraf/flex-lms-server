import httpStatus from "http-status";
import { merge } from "lodash";
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

  // Merge the payload into the existing user data
  const mergedUserData = merge(user.toObject(), updateFields);

  const updatedUser = await UserModel.findByIdAndUpdate(userId, {
    $set: mergedUserData,
  });

  return updatedUser;
};

const getAllUserFromdb = async () => {
  const users = await UserModel.find().sort({ role: 1 });
  const userLength = await UserModel.countDocuments();
  if (!users) {
    throw new ApiError(httpStatus.NOT_FOUND, "Users not found");
  }

  const result = {
    users,
    userLength,
  };

  return result;
};

const userRoleService = async (userId: string, role: string) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  );
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

export const userService = {
  updateUserAvatarIntodb,
  updateUserIntodb,
  getAllUserFromdb,
  userRoleService,
};
