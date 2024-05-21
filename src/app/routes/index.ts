import express from "express";
import {
  categoryRoute,
  subcategoryRoute,
} from "../modules/category/category.route";
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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
