import express from "express";
import { AdminRoutes } from "../modules/userManagement/admin/admin.route";
import AuthRouters from "../modules/userManagement/auth/auth.route";
import StudentRoutes from "../modules/userManagement/student/student.route";
import UserRoutes from "../modules/userManagement/user/user.route";

const router = express();
const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/students",
    route: StudentRoutes
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/auth",
    route: AuthRouters,
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
