import httpStatus from "http-status";
import ApiError from "../../errorHandlers/ApiError";
import { slugify } from "../../helper/slugify";
import { CategoryModel, SubCategoryModel } from "./category.model";

const getAllCategoryAndSubcategoryFromdb = async () => {
  const category = await CategoryModel.aggregate([
    {
      $lookup: {
        from: "subcategories",
        localField: "_id",
        foreignField: "category",
        as: "subcategory",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        slug: 1,
        subcategory: {
          $map: {
            input: "$subcategory",
            as: "subcategory",
            in: {
              _id: "$$subcategory._id",
              name: "$$subcategory.name",
              slug: "$$subcategory.slug",
            },
          },
        },
      },
    },
  ]);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  }

  return category;
};

//category crud services
const createCategoryIntodb = async (name: string, slug: string) => {
  const isExistCategory = await CategoryModel.findOne({ name: name });
  if (isExistCategory) {
    throw new ApiError(httpStatus.BAD_REQUEST, "category alredy exist");
  }

  const category = await CategoryModel.create({
    name,
    slug,
  });

  return category;
};

const getAllCategoryFromdb = async () => {
  const category = await CategoryModel.find();
  if (!category) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You dont have any category");
  }
  const categoryLength = await CategoryModel.countDocuments();

  return {
    category,
    categoryLength,
  };
};

const getSingleCategoryFromdb = async (slug: string) => {
  const category = await CategoryModel.findOne({ slug: slug });
  if (!category) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Category not found!");
  }

  return category;
};

const updateCategoryInfodb = async (name: string, id: string) => {
  const slug = slugify(name);

  const category = await CategoryModel.findByIdAndUpdate(
    id,
    {
      name,
      slug,
    },
    { new: true }
  );
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found!");
  }

  return category;
};

const deleteCategoryFromdb = async (id: string) => {
  const category = await CategoryModel.findByIdAndDelete(
    { _id: id },
    { new: true }
  );

  if (!category) {
    throw new ApiError(
      httpStatus.NOT_FOUND,

      "Category not found!"
    );
  }
  await SubCategoryModel.deleteMany({ category: id });
};

//subcategory crud services
const createSubcategoryIntodb = async (name: string, categoryId: string) => {
  const slug = slugify(name);

  const isExistSubcategory = await SubCategoryModel.findOne({ name: name });
  if (isExistSubcategory) {
    throw new ApiError(httpStatus.BAD_REQUEST, "subcategory alredy exist");
  }

  const subcategory = await SubCategoryModel.create({
    name,
    slug,
    category: categoryId,
  });

  return subcategory;
};

const getAllSubcategoryFromdb = async () => {
  const subcategory = await SubCategoryModel.find();
  if (!subcategory) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You dont have any subcategory");
  }

  return subcategory;
};

const getSingleSubcategoryFromdb = async (slug: string) => {
  const category = await SubCategoryModel.findOne({ slug: slug });
  if (!category) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Subcategory not found!");
  }

  return category;
};

const updateSubcategoryInfodb = async (name: string, id: string) => {
  const slug = slugify(name);

  const subcategory = await SubCategoryModel.findByIdAndUpdate(
    id,
    {
      name,
      slug,
    },
    { new: true }
  );
  if (!subcategory) {
    throw new ApiError(httpStatus.NOT_FOUND, "Subcategory not found!");
  }

  return subcategory;
};

const deleteSubcategoryFromdb = async (id: string) => {
  const category = await SubCategoryModel.findByIdAndDelete(
    { _id: id },
    { new: true }
  );

  if (!category) {
    throw new ApiError(
      httpStatus.NOT_FOUND,

      "Subcategory not found!"
    );
  }
};

export const categoryService = {
  getAllCategoryAndSubcategoryFromdb,
  createCategoryIntodb,
  getAllCategoryFromdb,
  getSingleCategoryFromdb,
  updateCategoryInfodb,
  deleteCategoryFromdb,
  createSubcategoryIntodb,
  getAllSubcategoryFromdb,
  getSingleSubcategoryFromdb,
  updateSubcategoryInfodb,
  deleteSubcategoryFromdb,
};
