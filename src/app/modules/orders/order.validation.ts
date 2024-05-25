import Joi from "joi";

const orderSchema = Joi.object({
  items: Joi.array().items({
    course: Joi.string().required(),
    price: Joi.number().required(),
  }),
  accountType: Joi.string().required(),
  accountNumber: Joi.string().required(),
  transactionId: Joi.string().required(),
});

const updateOrderStatusSchema = Joi.object({
  orderStatus: Joi.string().valid("Approved", "Pending", "Rejected").required(),
});

export const orderValidationSchema = { orderSchema, updateOrderStatusSchema };
