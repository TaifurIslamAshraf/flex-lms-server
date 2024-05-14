import httpStatus from "http-status";
import ApiError from "../../errorHandlers/ApiError";
import { deleteFile } from "../../helper/deleteFile";
import { slugify } from "../../helper/slugify";
import catchAsync from "../../utilities/catchAsync";
import sendResponse from "../../utilities/sendResponse";
import { ICourse } from "./course.interface";
import courseModel from "./course.model";
import { courseServices } from "./course.service";

//create course
const createCourse = catchAsync(async (req, res) => {
  const {
    instructor,
    name,
    description,
    price,
    estimatedPrice,
    tags,
    level,
    demoUrl,
    benefits,
    prerequistites,
    courseData,
    materialIncludes,
    courseDuration,
  } = req.body as ICourse;

  const coursePayload: Record<string, unknown> = {
    instructor,
    name,
    description,
    price,
    estimatedPrice,
    tags,
    level,
    demoUrl,
    benefits,
    prerequistites,
    courseData,
    materialIncludes,
    courseDuration,
  };

  //generate slug
  coursePayload.slug = slugify(name);

  if (!req.file) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "thumbnail Images are required!"
    );
  }

  const nameisExitst = await courseModel.findOne({ name });
  if (nameisExitst) {
    deleteFile(req.file.path);
    throw new ApiError(httpStatus.BAD_REQUEST, "Course name should be unique");
  }

  if (req.files) {
    coursePayload.thumbnail = req.file?.path;
  }

  const result = await courseServices.createCourseIntodb(coursePayload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "course create was successfully",
    data: result,
  });
});

//get all course
const getAllCourse = catchAsync(async (req, res) => {
  const result = await courseServices.getAllCourseFromdb();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "all course get was successfully",
    data: result,
  });
});

//get single course
const getSingleCourse = catchAsync(async (req, res) => {
  const { slug } = req.params;

  const result = await courseServices.getSingleCourseFromdb(slug);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "single course get was successfully",
    data: result,
  });
});

export const courseController = { createCourse, getAllCourse, getSingleCourse };
