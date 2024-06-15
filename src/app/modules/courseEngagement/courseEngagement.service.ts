import httpStatus from "http-status";
import { Types } from "mongoose";
import ApiError from "../../errorHandlers/ApiError";
import courseModel from "../courseManagement/course.model";
import {
  ICreateCourseEngagement,
  IPurchasedCourses,
  ISyncCourseEngagement,
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

//user courses
const getAllUserCoursesFromdb = async (userId: string) => {
  const pipeline = [
    { $match: { user: new Types.ObjectId(userId) } },
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "courseDetails",
      },
    },
    {
      $unwind: "$courseDetails",
    },
    {
      $project: {
        _id: 1,
        title: "$courseDetails.name",
        thumbnail: "$courseDetails.thumbnail",
        slug: "$courseDetails.slug",
        videoDataLength: { $size: "$courseDetails.courseData" },
        completedVideoLength: { $size: "$videosCompleted" },
        progress: 1,
        completed: 1,
      },
    },
  ];

  const course = await CourseEngagementModel.aggregate(pipeline);

  return course;
};

//single user course
const getSingleUserCourseFromdb = async (courseId: string, userId: string) => {
  const course = await CourseEngagementModel.findOne({
    user: userId,
    course: { $in: courseId },
  }).populate("course");

  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, "Course not found");
  }

  return course;
};

//sync user engagement
const syncCourseEngagement = async (
  payload: ISyncCourseEngagement,
  userId: string
) => {
  const courseEngagement = await getSingleUserCourseFromdb(
    payload.course,
    userId
  );

  Object.keys(payload).forEach((key) => {
    const keyTyped = key as keyof typeof payload;

    if (payload[keyTyped] === undefined) {
      delete payload[keyTyped];
    }
  });

  // If the videosCompleted field is being updated, calculate the new progress
  if (payload.videosCompleted) {
    const newUniqueVideos = payload.videosCompleted.filter(
      (video) => !(courseEngagement?.videosCompleted || []).includes(video)
    );

    if (newUniqueVideos.length > 0) {
      // Merge the existing videosCompleted with the new unique ones
      const mergedVideosCompleted = [
        ...(courseEngagement?.videosCompleted || []),
        ...newUniqueVideos,
      ];

      // Update payload.videosCompleted with merged values
      payload.videosCompleted = mergedVideosCompleted;

      // Calculate the new progress
      const totalVideos = await courseModel
        .findById(payload.course)
        .select("courseData")
        .lean();
      const totalVideoCount = totalVideos?.courseData.length || 0;

      const completedVideoCount = mergedVideosCompleted.length;

      payload.progress = (completedVideoCount / totalVideoCount) * 100;
    } else {
      // If no new unique videos, remove videosCompleted from payload
      delete payload.videosCompleted;
    }
  }

  const updatedCourseEngagement = await CourseEngagementModel.findByIdAndUpdate(
    courseEngagement?._id,
    payload,
    { new: true, runValidators: true }
  );

  return updatedCourseEngagement;
};

//sync progress when video is added
const updateProgressForAllUsersInCourse = async (courseId: string) => {
  const course = await courseModel
    .findById(courseId)
    .select("courseData")
    .lean();
  const totalVideoCount = course?.courseData?.length || 0;

  if (totalVideoCount === 0) {
    return;
  }

  // Fetch all course engagements for this course
  const courseEngagements = await CourseEngagementModel.find({
    course: courseId,
  });

  // Recalculate progress for each user's engagement
  const bulkOps = courseEngagements.map((engagement) => {
    const completedVideoCount = engagement?.videosCompleted?.length || 0;
    const progress = (completedVideoCount / totalVideoCount) * 100;

    return {
      updateOne: {
        filter: { _id: engagement._id },
        update: { progress: Math.floor(progress) },
      },
    };
  });

  // Perform bulk update
  if (bulkOps.length > 0) {
    await CourseEngagementModel.bulkWrite(bulkOps);
  }
};

export const courseEngagementServices = {
  createCourseEngagementIntodb,
  isPurchasedCourses,
  getAllUserCoursesFromdb,
  getSingleUserCourseFromdb,
  syncCourseEngagement,
  updateProgressForAllUsersInCourse,
};
