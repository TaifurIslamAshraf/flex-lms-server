import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "category name is required",
    "string.empty": "category name is required",
  }),
});

export const updateCategorySchema = Joi.object({
  id: Joi.string().required().messages({
    "any.required": "category id is required",
    "string.empty": "category id is required",
  }),
  name: Joi.string().required().messages({
    "any.required": "category name is required",
    "string.empty": "category name is required",
  }),
});

export const createSubCategorySchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "category name is required",
    "string.empty": "category name is required",
  }),
  category: Joi.string().required().messages({
    "any.required": "category is required",
    "string.empty": "category is required",
  }),
});
