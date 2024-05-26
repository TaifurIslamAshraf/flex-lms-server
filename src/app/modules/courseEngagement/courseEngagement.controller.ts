import httpStatus from "http-status";
import catchAsync from "../../utilities/catchAsync";
import sendResponse from "../../utilities/sendResponse";
import { ISyncCourseEngagement } from "./courseEngagement.interface";
import { courseEngagementServices } from "./courseEngagement.service";

const allUserCourses = catchAsync(async (req, res) => {
  const userId = res.locals?.user?._id;

  const result = await courseEngagementServices.getAllUserCoursesFromdb(userId);

  sendResponse(res, {
    message: "Your all course here",
    statusCode: httpStatus.OK,
    data: result,
  });
});

const getSingleUserCourse = catchAsync(async (req, res) => {
  const userId = res.locals?.user?._id;
  const { courseId } = req.params;

  const course = await courseEngagementServices.getSingleUserCourseFromdb(
    courseId,
    userId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Course get successfull",
    data: course,
  });
});

const syncUserEngagement = catchAsync(async (req, res) => {
  const { completed, videosCompleted, currentVideo, course } =
    req.body as ISyncCourseEngagement;

  const userId = res.locals?.user?._id;

  const payload: ISyncCourseEngagement = {
    completed,
    videosCompleted,
    currentVideo,
    course: String(course),
  };

  const result = await courseEngagementServices.syncCourseEngagement(
    payload,
    userId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User Engagement sync successfull",
    data: result,
  });
});

export const courseEngagementControllers = {
  allUserCourses,
  getSingleUserCourse,
  syncUserEngagement,
};
