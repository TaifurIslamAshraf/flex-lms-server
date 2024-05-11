import express from "express";
import authGuard from "../../../middlewares/authGuard";
import { validateRequestWithJoi } from "../../../middlewares/validateRequest";
import { studentController } from "./student.controller";
import { updateJoyStudentValidationSchema } from "./student.validation";


const StudentRoutes = express.Router()

StudentRoutes.get(
    '/all-students',
    authGuard("admin", "superAdmin"),
    studentController.getAllStudents
)

StudentRoutes.get(
    '/:id',
    authGuard('student', 'admin', "faculty", "superAdmin"),
    studentController.getSingleStudents
)

StudentRoutes.patch(
    '/:id',
    validateRequestWithJoi(updateJoyStudentValidationSchema),
    studentController.updateStudent
)

StudentRoutes.delete('/:id', studentController.deleteAStudent)

export default StudentRoutes