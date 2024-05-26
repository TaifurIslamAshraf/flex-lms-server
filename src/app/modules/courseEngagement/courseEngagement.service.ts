import httpStatus from "http-status";
import ApiError from "../../errorHandlers/ApiError";
import {
  ICreateCourseEngagement,
  IPurchasedCourses,
} from "./courseEngagement.interface";
import CourseEngagementModel from "./courseEngagement.model";

const createCourseEngagementIntodb = async (
  payload: ICreateCourseEngagement
) => {
  payload.course?.forEach(async (item) => {
    await CourseEngagementModel.create({
      user: payload.user,
      course: item,
    });
  });
};

const isPurchasedCourses = async (
  userId: string,
  course: IPurchasedCourses
) => {
  const purchasedCourses = await CourseEngagementModel.find({
    user: userId,
    course: { $in: course.map((item) => item.course) },
  });

  if (purchasedCourses && purchasedCourses.length > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You alredy purchased");
  }
};

export const courseEngagementServices = {
  createCourseEngagementIntodb,
  isPurchasedCourses,
};
