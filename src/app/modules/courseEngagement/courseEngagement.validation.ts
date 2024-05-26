import Joi from "joi";

const syncCourseEngagementSchema = Joi.object({
  course: Joi.string().required(),
  completed: Joi.boolean(),
  videosCompleted: Joi.array().items(Joi.string()),
  currentVideo: Joi.string().allow(null),
});

export const courseEngagementValidation = { syncCourseEngagementSchema };
