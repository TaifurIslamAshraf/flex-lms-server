import Joi from "joi";

const videoResourceSchema = Joi.object({
  title: Joi.string(),
  url: Joi.string(),
});

const commentSchema = Joi.object({
  user: Joi.string().required(), // Assuming user ID is a string
  qustion: Joi.string(),
  qustionReplies: Joi.array().items(Joi.object()), // Assuming object structure
});

const courseDataSchema = Joi.object({
  videoTitle: Joi.string().required(),
  videoDescription: Joi.string().required(),
  videoUrl: Joi.string().required(),
  videoSection: Joi.string().required(),
  videoLength: Joi.number().required(),
  videoPlayer: Joi.string().required(),
  videoResource: Joi.array().items(videoResourceSchema),
  contentDrip: Joi.boolean(),
  qustions: Joi.array().items(commentSchema),
});

const reviewSchema = Joi.object({
  user: Joi.string().required(), // Assuming user ID is a string
  rating: Joi.number().required(),
  comment: Joi.string(),
  commentReplies: Joi.array().items(Joi.object()), // Assuming object structure
});

const createCourse = Joi.object({
  instructor: Joi.string().required(), // Assuming user ID is a string
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  estimatedPrice: Joi.number(),

  tags: Joi.string().required(),
  level: Joi.string().valid("beginner", "intermediate", "expert").required(),
  demoUrl: Joi.string().required(),

  benefits: Joi.array()
    .items(Joi.object({ title: Joi.string().required() }))
    .required(),
  prerequistites: Joi.array()
    .items(Joi.object({ title: Joi.string() }))
    .required(),
  details: Joi.array()
    .items(Joi.object({ title: Joi.string() }))
    .required(),

  courseDuration: Joi.string().required(),
  reviews: Joi.array().items(reviewSchema),
  courseData: Joi.array().items(courseDataSchema),
  rating: Joi.number().default(0),
  purchased: Joi.number().default(0),
  category: Joi.string().required(),
  subcategory: Joi.string().required(),
});

export const courseValidationSchema = { createCourse };
