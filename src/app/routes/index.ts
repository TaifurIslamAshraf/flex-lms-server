import express from "express";
import cartRouter from "../modules/cart/cart.route";
import {
  categoryRoute,
  subcategoryRoute,
} from "../modules/category/category.route";
import chartRoutes from "../modules/charts/chart.route";
import courseEngagementRouter from "../modules/courseEngagement/courseEngagement.route";
import courseRoutes from "../modules/courseManagement/course.route";
import LayoutRouter from "../modules/layout/layout.route";
import orderRouter from "../modules/orders/order.route";
import authRouter from "../modules/userManagement/auth/auth.route";
import userRouter from "../modules/userManagement/user/user.route";

const router = express();
const moduleRoutes = [
  {
    path: "/users",
    route: userRouter,
  },

  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/category",
    route: categoryRoute,
  },
  {
    path: "/subcategory",
    route: subcategoryRoute,
  },
  {
    path: "/course",
    route: courseRoutes,
  },
  {
    path: "/order",
    route: orderRouter,
  },
  {
    path: "/course-engagement",
    route: courseEngagementRouter,
  },
  {
    path: "/cart",
    route: cartRouter,
  },
  {
    path: "/layout",
    route: LayoutRouter,
  },
  {
    path: "/chart",
    route: chartRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
