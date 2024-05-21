import { Router } from "express";
import { upload } from "../../../config/multer.config";
import { authorizeUser, isAuthenticated } from "../../../middlewares/authGuard";
import { validateRequestWithJoi } from "../../../middlewares/validateRequest";
import { userControllers } from "./user.controller";
import { updateUserInfoSchema } from "./user.validation";

const userRouter = Router();

userRouter.get(
  "/getAllUsers",
  isAuthenticated,
  authorizeUser("admin"),
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
  authorizeUser("admin"),
  userControllers.updateUserRole
);

export default userRouter;
