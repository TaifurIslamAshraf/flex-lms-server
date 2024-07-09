import { Router } from "express";
import { isAuthenticated } from "../../../middlewares/authGuard";
import { validateRequestWithJoi } from "../../../middlewares/validateRequest";
import { authControllers } from "./auth.controller";
import {
  activateUserSchema,
  loginSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  userSchema,
} from "./auth.validation";

const authRouter = Router();

authRouter.post(
  "/register",
  validateRequestWithJoi(userSchema),
  authControllers.registerUser
);

authRouter.post(
  "/activate",
  validateRequestWithJoi(activateUserSchema),
  authControllers.activateUser
);

authRouter.post(
  "/login",
  validateRequestWithJoi(loginSchema),
  authControllers.loginUser
);

authRouter.get("/logout", isAuthenticated, authControllers.logout);

authRouter.post("/refresh", authControllers.updateAccessToken);

authRouter.put(
  "/update-password",
  isAuthenticated,
  validateRequestWithJoi(updatePasswordSchema),

  authControllers.updatePassword
);

authRouter.post("/forgot-password", authControllers.forgotPassword);
authRouter.get(
  "/forgot-password-link-validation/:userId/:token",
  authControllers.forgotPasswordLinkValidation
);
authRouter.put(
  "/reset-password",
  validateRequestWithJoi(resetPasswordSchema),
  authControllers.resetPassword
);

export default authRouter;
