import { Router } from "express";
import { upload } from "../../config/multer.config";
import { authorizeUser, isAuthenticated } from "../../middlewares/authGuard";
import { courseController } from "./course.controller";

const courseRoutes = Router();

courseRoutes.post(
  "/create-course",
  isAuthenticated,
  authorizeUser("admin", "instructor"),
  //   validateRequestWithJoi(courseValidationSchema.createCourse),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "materialIncludes", maxCount: 10 },
  ]),
  courseController.createCourse
);

courseRoutes.get("/all-courses", courseController.getAllCourse);
courseRoutes.get("/single-course/:slug", courseController.getSingleCourse);

export default courseRoutes;
