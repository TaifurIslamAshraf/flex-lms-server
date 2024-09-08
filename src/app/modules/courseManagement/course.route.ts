import { Router } from "express";
import { upload } from "../../config/multer.config";
import { authorizeUser, isAuthenticated } from "../../middlewares/authGuard";
import { validateRequestWithJoi } from "../../middlewares/validateRequest";
import { courseController } from "./course.controller";
import { courseValidationSchema } from "./course.validation";

const courseRoutes = Router();

courseRoutes.post(
  "/create-course",
  isAuthenticated,
  authorizeUser("admin", "instructor", "superAdmin"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "materialIncludes", maxCount: 10 },
  ]),
  validateRequestWithJoi(courseValidationSchema.createCourse),

  courseController.createCourse
);

courseRoutes.put(
  "/update-course/:id",
  isAuthenticated,
  authorizeUser("admin", "instructor", "superAdmin"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "materialIncludes", maxCount: 10 },
  ]),
  courseController.updateCourse
);

courseRoutes.get("/all-courses", courseController.getAllCourse);
courseRoutes.get("/random-courses", courseController.getRandomCourse);
courseRoutes.get("/featured-courses", courseController.getFeaturedCourse);
courseRoutes.get(
  "/random-category-courses",
  courseController.getRandomCategoryCourse
);

courseRoutes.get(
  "/best-selling",
  isAuthenticated,
  authorizeUser("admin", "superAdmin"),
  courseController.getBestSellingCourse
);

courseRoutes.get("/single-course/:slug", courseController.getSingleCourse);
courseRoutes.get(
  "/admin-single-course/:slug",
  isAuthenticated,
  authorizeUser("admin", "instructor", "superAdmin"),
  courseController.getSingleCourseForAdmin
);

courseRoutes.delete(
  "/delete-course/:id",
  isAuthenticated,
  authorizeUser("superAdmin"),
  courseController.deleteCourse
);

export default courseRoutes;
