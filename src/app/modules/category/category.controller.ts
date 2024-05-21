import httpStatus from "http-status";
import { slugify } from "../../helper/slugify";
import catchAsync from "../../utilities/catchAsync";
import sendResponse from "../../utilities/sendResponse";
import { categoryService } from "./category.service";

//get all category and sub category
const getAllCategoryAndSubCategory = catchAsync(async (req, res) => {
  const category = await categoryService.getAllCategoryAndSubcategoryFromdb();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Category and subcategory",
    data: category,
  });
});

// category crud endpoint
const createCategory = catchAsync(async (req, res) => {
  const { name } = req.body;

  const slug = slugify(name);

  const category = await categoryService.createCategoryIntodb(name, slug);

  sendResponse(res, {
    statusCode: httpStatus.OK,

    message: "Category create successfull",
    data: category,
  });
});

const getAllCategory = catchAsync(async (req, res) => {
  const result = await categoryService.getAllCategoryFromdb();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "All category here",
    data: result,
  });
});

const getSignleCategory = catchAsync(async (req, res) => {
  const slug = req.params.slug;

  const category = await categoryService.getSingleCategoryFromdb(slug);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: category,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const { name, id } = req.body;

  const category = await categoryService.updateCategoryInfodb(name, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Category updated successfull",
    data: category,
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  const id = req.params.id;

  await categoryService.deleteCategoryFromdb(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "category and subcategory deleted successfull",
  });
});

// sub category crud endpoint
const createSubcategory = catchAsync(async (req, res) => {
  const { name, category } = req.body;

  const subcategory = await categoryService.createSubcategoryIntodb(
    name,
    category
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Subcategory create successfull",
    data: subcategory,
  });
});

const getAllSubcategory = catchAsync(async (req, res) => {
  const subcategory = await categoryService.getAllSubcategoryFromdb();

  sendResponse(res, {
    message: "All subcategory here",
    statusCode: httpStatus.OK,
    data: subcategory,
  });
});

const getSignleSubcategory = catchAsync(async (req, res) => {
  const slug = req.params.slug;

  const subcategory = await categoryService.getSingleSubcategoryFromdb(slug);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: subcategory,
  });
});

const updateSubcategory = catchAsync(async (req, res) => {
  const { name, id } = req.body;

  const subcategory = await categoryService.updateSubcategoryInfodb(name, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Subcategory updated successfull",
    data: subcategory,
  });
});

const deleteSubcategory = catchAsync(async (req, res) => {
  const id = req.params.id;

  await categoryService.deleteSubcategoryFromdb(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "subcategory deleted successfull",
  });
});

export const categoryControllers = {
  getAllCategoryAndSubCategory,
  getAllCategory,
  getAllSubcategory,
  createCategory,
  getSignleCategory,
  getSignleSubcategory,
  updateCategory,
  updateSubcategory,
  deleteCategory,
  deleteSubcategory,
  createSubcategory,
};
