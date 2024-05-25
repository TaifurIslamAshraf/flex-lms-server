import { Router } from "express";
import { authorizeUser, isAuthenticated } from "../../middlewares/authGuard";
import { validateRequestWithJoi } from "../../middlewares/validateRequest";
import { orderControllers } from "./order.controller";
import { orderValidationSchema } from "./order.validation";

const orderRouter = Router();

orderRouter.post(
  "/create-order",
  isAuthenticated,
  validateRequestWithJoi(orderValidationSchema.orderSchema),
  orderControllers.createOrder
);

orderRouter.get(
  "/all-orders",
  isAuthenticated,
  authorizeUser("admin"),
  orderControllers.getAllOrders
);

orderRouter.get(
  "/single-order/:id",
  isAuthenticated,
  authorizeUser("admin"),
  orderControllers.getSingleOrders
);

orderRouter.put(
  "/update-order/:id",
  isAuthenticated,
  authorizeUser("admin"),
  validateRequestWithJoi(orderValidationSchema.updateOrderStatusSchema),
  orderControllers.updateOrderStatus
);

orderRouter.delete(
  "/delete-order/:id",
  isAuthenticated,
  authorizeUser("admin"),
  orderControllers.deleteOrder
);

export default orderRouter;
