import { ICreateCourseEngagement } from "./courseEngagement.interface";
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

export const courseEngagementServices = { createCourseEngagementIntodb };
