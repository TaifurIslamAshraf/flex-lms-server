import { Router } from "express";
import { isAuthenticated } from "../../middlewares/authGuard";
import { validateRequestWithJoi } from "../../middlewares/validateRequest";
import { cartControllers } from "./cart.controller";
import { cartValidatorSchema } from "./cart.validation";

const cartRouter = Router();

cartRouter.put(
  "/add-to-cart",
  isAuthenticated,
  validateRequestWithJoi(cartValidatorSchema.addToCartSchema),
  cartControllers.addToCart
);

cartRouter.put(
  "/remove-to-cart",
  isAuthenticated,
  validateRequestWithJoi(cartValidatorSchema.addToCartSchema),
  cartControllers.removeFromCart
);

export default cartRouter;
