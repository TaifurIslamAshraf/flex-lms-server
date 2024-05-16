import { NextFunction, Request, Response } from "express";
import { AnySchema } from "joi";
import { AnyZodObject, ZodEffects } from "zod";
import imgDelete from "../utilities/imgDelete";

const validateRequest =
  (schema: AnyZodObject | ZodEffects<AnyZodObject>) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });
      return next();
    } catch (error) {
      imgDelete(req, next);
      next(error);
    }
  };

export const validateRequestWithJoi = (schema: AnySchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const option = {
      abortEarly: false,
      allowUnknown: true,
    };

    const { error, value } = schema.validate(req.body, option);

    if (error) {
      const errorMessage = error.details.map((datail) => datail.message);
      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    } else {
      req.body = value;
      next();
    }
  };
};

export default validateRequest;
