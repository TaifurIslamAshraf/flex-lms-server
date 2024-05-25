import httpStatus from "http-status";
import { merge } from "lodash";
import mongoose, { Types } from "mongoose";
import ApiError from "../../errorHandlers/ApiError";
import { deleteFile, deleteMultipleFile } from "../../helper/deleteFile";
import { AggregateQueryHelper } from "../../helper/query.helper";
import { logger } from "../../utilities/logger";
import { MulterFiles } from "./course.interface";
import courseModel from "./course.model";

const createCourseIntodb = async (coursePayload: Record<string, unknown>) => {
  const result = await courseModel.create(coursePayload);

  return result;
};

const getAllCourseFromdb = async (query: Record<string, unknown>) => {
  const aggregatePipeline = courseModel.aggregate();

  if (query.category) {
    query.category = new mongoose.Types.ObjectId(query.category as string);
  }
  if (query.subcategory) {
    query.subcategory = new mongoose.Types.ObjectId(
      query.subcategory as string
    );
  }

  const aggregateHelper = new AggregateQueryHelper(
    aggregatePipeline,
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

  const data = await aggregateHelper.model;
  const meta = await aggregateHelper.metaData();

  return { data, meta };
};

const getSingleCourseFromdb = async (slug: string) => {
  const result = await courseModel.findOne({ slug });

  return result;
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

  const nameisExitst = await courseModel
    .findOne({ name: coursePayload?.name })
    .exec();
  if (nameisExitst) {
    if (files.thumbnail) {
      await deleteFile(files.thumbnail[0].path);
    } else if (files.materialIncludes) {
      await deleteMultipleFile(files.materialIncludes.map((file) => file.path));
    }
    throw new ApiError(httpStatus.BAD_REQUEST, "Course name should be unique");
  }

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

export const courseServices = {
  createCourseIntodb,
  getAllCourseFromdb,
  getSingleCourseFromdb,
  updateCourseIntodb,
  deleteCourseFromdb,
};
