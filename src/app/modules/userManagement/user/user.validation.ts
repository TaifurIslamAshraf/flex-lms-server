import Joi from "joi";

export const instructorSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
});

export const userSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().valid("admin", "user", "instructor").default("user"),
  instructor: Joi.when("role", {
    is: "instructor",
    then: instructorSchema.optional(),
    otherwise: instructorSchema.optional(),
  }),
  avatar: Joi.string().optional(),
  address: Joi.string().optional(),
  fatherName: Joi.string().optional(),
  motherName: Joi.string().optional(),
  district: Joi.string().optional(),
  postCode: Joi.string().optional(),
});
