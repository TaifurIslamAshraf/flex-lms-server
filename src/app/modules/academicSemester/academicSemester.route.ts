import { Router } from "express";
import { academicSemesterControllers } from "./academicSemester.controller";
import { academicSemesterValidationSchema, updateAcademicSemesterValidationSchema } from "./academicSemester.validation";
import validateRequest from "../../middlewares/validateRequest";

const academicSemesterRoutes = Router()

academicSemesterRoutes.post(
    '/create-academic-semester',
    validateRequest(academicSemesterValidationSchema),
    academicSemesterControllers.createAcademicSemester
)

academicSemesterRoutes.get(
    '/get-academic-semester/:id',
    academicSemesterControllers.getAcademicSemester
)

academicSemesterRoutes.patch(
    '/update-academic-semester/:id',
    validateRequest(updateAcademicSemesterValidationSchema),
    academicSemesterControllers.updateAcademicSemester
)

academicSemesterRoutes.get(
    '/get-all-academic-semester',
    academicSemesterControllers.getAllAcademicSemester
)

export default academicSemesterRoutes