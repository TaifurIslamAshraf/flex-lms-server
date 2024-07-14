import Joi from "joi";

export const instructorSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
}).optional();

export const updateUserInfoSchema = Joi.object({
  phone: Joi.string().optional(),
  instructor: instructorSchema.optional(),
  address: Joi.string().optional(),
  fatherName: Joi.string().optional(),
  motherName: Joi.string().optional(),
  district: Joi.string().optional(),
  postCode: Joi.string().optional(),
});

export const roleUopdateSchema = Joi.object({
  id: Joi.string(),
  role: Joi.string().valid("admin", "user", "instructor", "superAdmin"),
});
