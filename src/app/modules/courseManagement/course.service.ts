import courseModel from "./course.model";

const createCourseIntodb = async (coursePayload: Record<string, unknown>) => {
  const result = await courseModel.create(coursePayload);

  return result;
};

const getAllCourseFromdb = async () => {
  const result = await courseModel.find();

  return result;
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
