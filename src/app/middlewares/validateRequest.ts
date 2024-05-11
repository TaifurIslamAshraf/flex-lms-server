import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodEffects } from "zod";
import imgDelete from "../utilities/imgDelete";
import { AnySchema } from "joi";

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
  return async (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body)
    if (error) return next(error)
    next()
  }
}

export default validateRequest;
