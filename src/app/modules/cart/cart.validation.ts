import Joi from "joi";

const addToCartSchema = Joi.object({
  courseId: Joi.string().required(),
});

export const cartValidatorSchema = { addToCartSchema };
