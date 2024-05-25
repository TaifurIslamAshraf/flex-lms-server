import express from "express";
import {
  categoryRoute,
  subcategoryRoute,
} from "../modules/category/category.route";
import courseRoutes from "../modules/courseManagement/course.route";
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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
