import httpStatus from "http-status";
import ApiError from "../../errorHandlers/ApiError";
import { deleteFile, deleteMultipleFiles } from "../../helper/deleteFile";
import { slugify } from "../../helper/slugify";
import catchAsync from "../../utilities/catchAsync";
import sendResponse from "../../utilities/sendResponse";
import { ICourse, MulterFiles } from "./course.interface";
import courseModel from "./course.model";
import { courseServices } from "./course.service";

//create course
const createCourse = catchAsync(async (req, res) => {
  const userId = res.locals?.user?._id;

  const {
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
    courseDuration,
    category,
    subcategory,
    details,
  } = req.body as ICourse;

  const coursePayload: Record<string, unknown> = {
    instructor: userId,
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
    courseDuration,
    category,
    subcategory,
    details,
  };

  coursePayload.slug = slugify(name);

  const files = req.files as MulterFiles;

  if (!files || !files.thumbnail) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Thumbnail image is required!");
  }

  if (files.thumbnail) {
    coursePayload.thumbnail = files.thumbnail[0].path;
  }

  if (files.materialIncludes) {
    coursePayload.materialIncludes = files.materialIncludes.map(
      (file) => file.path
    );
  }

  const nameisExitst = await courseModel.findOne({ name });
  if (nameisExitst) {
    if (files.thumbnail) {
      await deleteFile(files.thumbnail[0].path);
    } else if (files.materialIncludes) {
      await deleteMultipleFiles(
        files?.materialIncludes?.map((file) => file.path)
      );
    }
    throw new ApiError(httpStatus.BAD_REQUEST, "Course name should be unique");
  }

  const result = await courseServices.createCourseIntodb(coursePayload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Course created successfully",
    data: result,
  });
});

//get all course
const getAllCourse = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await courseServices.getAllCourseFromdb(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "all course get successfully",
    data: result,
  });
});

//get random course
const getRandomCourse = catchAsync(async (req, res) => {
  const courses = await courseServices.getRandomCourseFromdb();

  sendResponse(res, {
    message: "Random course get successfully",
    statusCode: httpStatus.OK,
    data: courses,
  });
});
const getFeaturedCourse = catchAsync(async (req, res) => {
  const courses = await courseServices.getFeaturedCourseFromdb(req.query);

  sendResponse(res, {
    message: "Featured course get successfully",
    statusCode: httpStatus.OK,
    data: courses,
  });
});

//get random category course
const getRandomCategoryCourse = catchAsync(async (req, res) => {
  const courses = await courseServices.getRandomSubcategoryCourseFromdb();

  sendResponse(res, {
    message: "Random category course get successfully",
    statusCode: httpStatus.OK,
    data: courses,
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

//get single course for admin
const getSingleCourseForAdmin = catchAsync(async (req, res) => {
  const { slug } = req.params;

  const result = await courseServices.getSingleCourseForAdminIntodb(slug);
  if (!result) {
    throw new ApiError(404, "Course Not found");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "single course get was successfully",
    data: result,
  });
});

//get best selling course
const getBestSellingCourse = catchAsync(async (req, res) => {
  const courses = await courseServices.getBestSellingCourseFromdb();

  sendResponse(res, {
    message: "best selling course get successfully",
    statusCode: httpStatus.OK,
    data: courses,
  });
});

// update course
const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;

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
    courseDuration,
    category,
    subcategory,
    details,
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
    courseDuration,
    category,
    subcategory,
    details,
  };

  if (name) {
    coursePayload.slug = slugify(name);
  }

  const files = req.files as MulterFiles;

  const result = await courseServices.updateCourseIntodb(
    coursePayload,
    id,
    files
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "course updated successfully",
    data: result,
  });
});

const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;

  await courseServices.deleteCourseFromdb(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Course deleted successfull",
  });
});

export const courseController = {
  createCourse,
  getAllCourse,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  getRandomCourse,
  getRandomCategoryCourse,
  getBestSellingCourse,
  getSingleCourseForAdmin,
  getFeaturedCourse,
};
