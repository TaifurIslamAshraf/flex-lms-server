import { Router } from "express";
import { upload } from "../../../config/multer.config";
import { authorizeUser, isAuthenticated } from "../../../middlewares/authGuard";
import { validateRequestWithJoi } from "../../../middlewares/validateRequest";
import { userControllers } from "./user.controller";
import { roleUopdateSchema, updateUserInfoSchema } from "./user.validation";

const userRouter = Router();

userRouter.get(
  "/getAllUsers",
  isAuthenticated,
  authorizeUser("admin", "superAdmin"),
  userControllers.getAllUsers
);

userRouter.get("/me", isAuthenticated, userControllers.getUserInfo);
userRouter.put(
  "/update-info",
  isAuthenticated,
  validateRequestWithJoi(updateUserInfoSchema),
  userControllers.updateUserInfo
);
userRouter.put(
  "/update-avatar",
  isAuthenticated,
  upload.single("avatar"),
  userControllers.updateUserAvatar
);

userRouter.put(
  "/update-avatar",
  isAuthenticated,
  upload.single("avatar"),
  userControllers.updateUserAvatar
);

userRouter.put(
  "/update-role",
  isAuthenticated,
  authorizeUser("superAdmin"),
  validateRequestWithJoi(roleUopdateSchema),
  userControllers.updateUserRole
);

export default userRouter;
