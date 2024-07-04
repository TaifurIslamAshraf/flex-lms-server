import httpStatus from "http-status";
import { merge } from "lodash";
import mongoose, { Types } from "mongoose";
import ApiError from "../../errorHandlers/ApiError";
import { deleteFile, deleteMultipleFile } from "../../helper/deleteFile";
import { AggregateQueryHelper } from "../../helper/query.helper";
import { logger } from "../../utilities/logger";
import { SubCategoryModel } from "../category/category.model";
import { courseEngagementServices } from "../courseEngagement/courseEngagement.service";
import { ICourse, MulterFiles } from "./course.interface";
import courseModel from "./course.model";

const createCourseIntodb = async (coursePayload: Record<string, unknown>) => {
  const result = await courseModel.create(coursePayload);

  return result;
};

const getAllCourseFromdb = async (query: Record<string, unknown>) => {
  const aggregatePipeline = [
    {
      $lookup: {
        from: "users",
        localField: "instructor",
        foreignField: "_id",
        as: "instructor",
        pipeline: [
          {
            $project: {
              _id: 0,
              name: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$instructor",
    },
    {
      $project: {
        courseData: 0,
        description: 0,
        details: 0,
        category: 0,
        subcategory: 0,
        tags: 0,
        level: 0,
        demoUrl: 0,
        benefits: 0,
        prerequistites: 0,
        courseDuration: 0,
        materialIncludes: 0,
        purchased: 0,
        createdAt: 0,
        updatedAt: 0,
      },
    },
  ];

  if (query.category) {
    query.category = new mongoose.Types.ObjectId(query.category as string);
  }
  if (query.subcategory) {
    query.subcategory = new mongoose.Types.ObjectId(
      query.subcategory as string
    );
  }

  const aggregateHelper = new AggregateQueryHelper(
    courseModel.aggregate(aggregatePipeline),
    query,
    courseModel
  );

  aggregateHelper
    .search()
    .filterByCategory()
    .filterBySubCategory()
    .filterByPrice()
    .filterByLevel()
    .paginate();

  const data = await aggregateHelper.model.exec();
  const meta = await aggregateHelper.metaData();

  return { data, meta };
};

const getRandomCourseFromdb = async () => {
  const aggregatePipeline = [
    {
      $sample: { size: 5 },
    },
    {
      $project: {
        courseData: 0,
        category: 0,
        subcategory: 0,
        tags: 0,
        level: 0,
        demoUrl: 0,
        benefits: 0,
        prerequistites: 0,
        courseDuration: 0,
        materialIncludes: 0,
        purchased: 0,
      },
    },
  ];

  const courses = await courseModel.aggregate(aggregatePipeline);
  return courses;
};

const getRandomSubcategoryCourseFromdb = async () => {
  const aggregatePipeline = [
    { $sample: { size: 7 } },
    {
      $project: {
        _id: 1,
        name: 1,
        slug: 1,
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "_id",
        foreignField: "subcategory",
        as: "courses",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        slug: 1,
        courses: {
          _id: 1,
          name: 1,
          slug: 1,
          price: 1,
          estimatedPrice: 1,
          thumbnail: 1,
          reviews: 1,
          rating: 1,
        },
      },
    },
  ];

  const randomSubcategories =
    await SubCategoryModel.aggregate(aggregatePipeline);
  return randomSubcategories;
};

const getSingleCourseFromdb = async (slug: string) => {
  const result = await courseModel
    .findOne({ slug })
    .select([
      "-purchased",
      "-subcategory",
      "-category",
      "-courseData.videoDescription",
      "-courseData.videoUrl",
      "-courseData.videoLength",
      "-courseData.videoPlayer",
      "-courseData.videoResource",
      "-courseData.qustions",
      "-courseData._id",
    ])
    .populate({
      path: "instructor",
      select: [
        "-cartItems",
        "-phone",
        "-email",
        "-role",
        "-createdAt",
        "-updatedAt",
        "-fatherName",
        "-motherName",
        "-postCode",
        "-district",
      ],
    });

  return result;
};

const getSingleCourseForAdminIntodb = async (slug: string) => {
  const course = await courseModel.findOne({ slug });

  return course;
};

const updateCourseIntodb = async (
  coursePayload: Record<string, unknown>,
  courseId: string,
  files: MulterFiles
) => {
  const course = await courseModel.findById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, "Course not found");
  }

  if (files.thumbnail) {
    coursePayload.thumbnail = files.thumbnail[0].path;
    deleteFile(course?.thumbnail);
  }

  if (files.materialIncludes) {
    coursePayload.materialIncludes = files.materialIncludes.map(
      (file) => file.path
    );

    deleteMultipleFile(course?.materialIncludes);
  }

  // const nameisExitst = await courseModel
  //   .findOne({ name: coursePayload?.name })
  //   .exec();
  // if (nameisExitst) {
  //   if (files.thumbnail) {
  //     await deleteFile(files.thumbnail[0].path);
  //   } else if (files.materialIncludes) {
  //     await deleteMultipleFile(files.materialIncludes.map((file) => file.path));
  //   }
  //   throw new ApiError(httpStatus.BAD_REQUEST, "Course name should be unique");
  // }

  const updatedFields = Object.entries(coursePayload).reduce(
    (acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }

      return acc;
    },
    {} as Record<string, unknown>
  );

  // merge the payload data into the existing course data
  const mergeCourseData = merge(course.toObject(), updatedFields);

  const updatedCourse = await courseModel.findByIdAndUpdate(
    courseId,
    {
      $set: mergeCourseData,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  //sync with course engagement
  if (updatedFields?.courseData) {
    await courseEngagementServices.updateProgressForAllUsersInCourse(courseId);
  }

  return updatedCourse;
};

const deleteCourseFromdb = async (courseId: string) => {
  if (!Types.ObjectId.isValid(courseId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid course ID");
  }

  const course = await courseModel.findById(courseId).exec();
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, "Course not found");
  }

  // Deleting file from server
  try {
    if (course.thumbnail) {
      await deleteFile(course.thumbnail);
    }
    if (course.materialIncludes && course.materialIncludes.length > 0) {
      await deleteMultipleFile(course.materialIncludes);
    }
  } catch (error) {
    // Handle file deletion errors (optional)
    logger.error("Error deleting files: ", error);
  }

  await course.deleteOne();
};

const getBestSellingCourseFromdb = async (): Promise<ICourse[]> => {
  const courses = await courseModel.aggregate([
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        thumbnail: { $first: "$thumbnail" },
        totalPurchased: { $sum: "$purchased" },
      },
    },
    {
      $sort: { totalPurchased: -1 },
    },
    {
      $limit: 3,
    },
  ]);

  return courses;
};

export const courseServices = {
  createCourseIntodb,
  getAllCourseFromdb,
  getSingleCourseFromdb,
  updateCourseIntodb,
  deleteCourseFromdb,
  getRandomCourseFromdb,
  getRandomSubcategoryCourseFromdb,
  getBestSellingCourseFromdb,
  getSingleCourseForAdminIntodb,
};
