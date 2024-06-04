import { Router } from "express";
import { upload } from "../../config/multer.config";
import { authorizeUser, isAuthenticated } from "../../middlewares/authGuard";
import { courseController } from "./course.controller";

const courseRoutes = Router();

courseRoutes.post(
  "/create-course",
  isAuthenticated,
  authorizeUser("admin", "instructor"),
  // validateRequestWithJoi(courseValidationSchema.createCourse),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "materialIncludes", maxCount: 10 },
  ]),
  courseController.createCourse
);

courseRoutes.put(
  "/update-course/:id",
  isAuthenticated,
  authorizeUser("admin", "instructor"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "materialIncludes", maxCount: 10 },
  ]),
  courseController.updateCourse
);

courseRoutes.get("/all-courses", courseController.getAllCourse);
courseRoutes.get("/random-courses", courseController.getRandomCourse);
courseRoutes.get("/single-course/:slug", courseController.getSingleCourse);

courseRoutes.delete(
  "/delete-course/:id",
  isAuthenticated,
  authorizeUser("admin"),
  courseController.deleteCourse
);

export default courseRoutes;
