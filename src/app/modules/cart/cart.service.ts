import httpStatus from "http-status";
import { Types } from "mongoose";
import ApiError from "../../errorHandlers/ApiError";
import CourseEngagementModel from "../courseEngagement/courseEngagement.model";
import UserModel from "../userManagement/user/user.model";

const addToCartFromdb = async (userId: string, courseId: string) => {
  if (!Types.ObjectId.isValid(courseId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid course id");
  }

  const alreadyBought = await CourseEngagementModel.exists({
    course: courseId,
    user: userId,
  });

  if (alreadyBought) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Course alredy purchesed");
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { $addToSet: { cartItems: courseId } },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  return updatedUser;
};

const removeFromCartIntodb = async (userId: string, courseId: string) => {
  if (!Types.ObjectId.isValid(courseId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid course id");
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { $pull: { cartItems: new Types.ObjectId(courseId) } },
    { new: true, runValidators: true }
  );
  if (!updatedUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  return updatedUser;
};

export const cartServices = { addToCartFromdb, removeFromCartIntodb };
