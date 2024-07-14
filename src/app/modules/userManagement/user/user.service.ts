import httpStatus from "http-status";
import { merge } from "lodash";
import ApiError from "../../../errorHandlers/ApiError";
import { deleteFile } from "../../../helper/deleteFile";
import { AggregateQueryHelper } from "../../../helper/query.helper";
import { IUser } from "../auth/auth.interface";
import { IRoleUopdate, IUserUpdate } from "./user.interface";
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

  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    {
      $set: mergedUserData,
    },
    { new: true, runValidators: true }
  );

  return updatedUser;
};

const getAllUserFromdb = async (query: Record<string, unknown>) => {
  const aggregatePipeline = UserModel.aggregate();

  const aggregateHelper = new AggregateQueryHelper(
    aggregatePipeline,
    query,
    UserModel
  );

  // Assuming you want to keep the sorting by role
  aggregatePipeline.sort({ role: 1 });
  aggregateHelper.paginate();
  aggregatePipeline.project({
    _id: 1,
    name: 1,
    email: 1,
    phone: 1,
    role: 1,
    avatar: 1,
  });

  const data = await aggregateHelper.model.exec();
  const meta = await aggregateHelper.metaData();

  return { data, meta };
};

const userRoleService = async ({ userId, role }: IRoleUopdate) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user?.role === "superAdmin") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Super Admin role non-updatable"
    );
  }
  if (role === "superAdmin") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Only one Super Admin allowed."
    );
  }

  user.role = role;

  await user.save();

  return user;
};

export const userService = {
  updateUserAvatarIntodb,
  updateUserIntodb,
  getAllUserFromdb,
  userRoleService,
};
