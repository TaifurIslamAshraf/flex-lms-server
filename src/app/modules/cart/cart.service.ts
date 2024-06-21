import httpStatus from "http-status";
import { Types } from "mongoose";
import ApiError from "../../errorHandlers/ApiError";
import CourseEngagementModel from "../courseEngagement/courseEngagement.model";
import courseModel from "../courseManagement/course.model";
import orderModel from "../orders/order.model";
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

  //if course alredy orderd
  await isCourseAllredyOrder(userId, [courseId]);

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

const getAllCartItemsFromdb = async (userId: string) => {
  const user = await UserModel.findById(userId).exec();

  if (!user) {
    throw new Error("User not found");
  }

  const cartItemIds = user.cartItems;

  const cartItems = await courseModel
    .find({
      _id: { $in: cartItemIds },
    })
    .select("_id thumbnail name price slug")
    .exec();

  return cartItems;
};

const clearCartIntodb = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid user id");
  }

  await UserModel.findByIdAndUpdate(
    userId,
    {
      $set: { cartItems: [] },
    },
    { new: true, runValidators: true }
  );
};

const isCourseAllredyOrder = async (userId: string, courseIds: string[]) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid user id");
  }

  const userIdObject = new Types.ObjectId(userId);
  const courseIdObjects = courseIds.map((id) => new Types.ObjectId(id));

  // Check if the user has already ordered any of the courses using aggregation
  const orderCheck = await orderModel.aggregate([
    { $match: { user: userIdObject } },
    { $unwind: "$items" },
    { $match: { "items.course": { $in: courseIdObjects } } },
    { $limit: 1 },
  ]);

  if (orderCheck.length > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Course already order");
  }
};

export const cartServices = {
  addToCartFromdb,
  removeFromCartIntodb,
  getAllCartItemsFromdb,
  clearCartIntodb,
  isCourseAllredyOrder,
};
