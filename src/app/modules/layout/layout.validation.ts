import Joi from "joi";

const fileSchema = Joi.object({
  fieldname: Joi.string().required(),
  originalname: Joi.string().required(),
  encoding: Joi.string().required(),
  mimetype: Joi.string()
    .valid(
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/svg",
      "image/jpg",
      "image/webp"
    )
    .required(),
  destination: Joi.string().required(),
  filename: Joi.string().required(),
  path: Joi.string().required(),
  size: Joi.number()
    .max(5 * 1024 * 1024)
    .required(), // 5MB max
});

export const createLayoutSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: fileSchema,
});

export const updateLayoutSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  image: fileSchema.optional(),
  selected: Joi.boolean().optional(),
});
