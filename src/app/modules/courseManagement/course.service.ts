import mongoose from "mongoose";
import { AggregateQueryHelper } from "../../helper/query.helper";
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

export const courseServices = {
  createCourseIntodb,
  getAllCourseFromdb,
  getSingleCourseFromdb,
};
