import { Router } from "express";
import { changePasswordValidationSchema, forgetPasswordValidationSchema, loginValidationSchema, refreshTokenValidationSchema, resetPasswordValidationSchema } from "./auth.validation";
import { authControllers } from "./auth.controller";
import { USER_ROLL } from "../user/user.const";
import validateRequest from "../../../middlewares/validateRequest";
import authGuard from "../../../middlewares/authGuard";

const AuthRouters = Router()

AuthRouters.post(
    '/login',
    validateRequest(loginValidationSchema),
    authControllers.loginUser
)

AuthRouters.post(
    '/change-password',
    authGuard(USER_ROLL.student, USER_ROLL.faculty, USER_ROLL.admin),
    validateRequest(changePasswordValidationSchema),
    authControllers.changePassword
)

AuthRouters.post(
    '/refresh-token',
    validateRequest(refreshTokenValidationSchema),
    authControllers.refreshToken
)

AuthRouters.post(
    '/forget-password',
    validateRequest(forgetPasswordValidationSchema),
    authControllers.forgetPassword
)

AuthRouters.post(
    '/reset-password',
    validateRequest(resetPasswordValidationSchema),
    authControllers.resetPassword
)

export default AuthRouters