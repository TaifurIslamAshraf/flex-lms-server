import express from "express";
import authGuard from "../../../middlewares/authGuard";
import validateRequest, { validateRequestWithJoi } from "../../../middlewares/validateRequest";
import formDataParse from "../../../utilities/formDataParse";
import imgUploader from "../../../utilities/imgUploader";
import { createAdminValidationSchema } from "../admin/admin.validation";
import { joyStudentValidationSchema } from "../student/student.validation";
import { USER_ROLL } from "./user.const";
import { userControllers } from "./user.controller";
import { userStatusValidationSchema } from "./user.validation";

const UserRoutes = express.Router()

UserRoutes.post(
    '/create-student',
    authGuard("superAdmin", USER_ROLL.admin),
    imgUploader.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "gallery", maxCount: 5 },
    ]),
    formDataParse,
    validateRequestWithJoi(joyStudentValidationSchema),
    userControllers.createStudent
)

UserRoutes.post(
    '/create-admin',
    authGuard("superAdmin"),
    validateRequest(createAdminValidationSchema),
    userControllers.createAdmin,
);

UserRoutes.patch(
    '/change-status/:id',
    authGuard('admin'),
    validateRequest(userStatusValidationSchema),
    userControllers.changeStatus,
);

UserRoutes.get(
    '/me',
    authGuard('student', 'faculty', 'admin', 'superAdmin'),
    userControllers.getMe,
);

export default UserRoutes