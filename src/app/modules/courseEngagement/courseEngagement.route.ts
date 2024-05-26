import { Router } from "express";
import { isAuthenticated } from "../../middlewares/authGuard";
import { validateRequestWithJoi } from "../../middlewares/validateRequest";
import { courseEngagementControllers } from "./courseEngagement.controller";
import { courseEngagementValidation } from "./courseEngagement.validation";

const courseEngagementRouter = Router();

courseEngagementRouter.get(
  "/my-learning",
  isAuthenticated,
  courseEngagementControllers.allUserCourses
);
courseEngagementRouter.get(
  "/my-learning/:courseId",
  isAuthenticated,
  courseEngagementControllers.getSingleUserCourse
);

courseEngagementRouter.put(
  "/engagement-sync",
  isAuthenticated,
  validateRequestWithJoi(courseEngagementValidation.syncCourseEngagementSchema),
  courseEngagementControllers.syncUserEngagement
);

export default courseEngagementRouter;
