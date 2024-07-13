import express from "express";
import { authorizeUser, isAuthenticated } from "../../middlewares/authGuard";
import { chartController } from "./chart.controller";

const chartRoutes = express.Router();

chartRoutes.get(
  "/order-trends",
  isAuthenticated,
  authorizeUser("superAdmin", "admin"),
  chartController.getSealesReport
);

chartRoutes.get(
  "/overview",
  isAuthenticated,
  authorizeUser("admin", "superAdmin"),
  chartController.getOverView
);

chartRoutes.get(
  "/order-status",
  isAuthenticated,
  authorizeUser("admin", "superAdmin"),
  chartController.getOrderStatus
);

export default chartRoutes;
