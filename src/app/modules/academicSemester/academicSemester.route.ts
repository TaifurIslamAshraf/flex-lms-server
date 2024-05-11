import { Router } from "express";
import { academicSemesterControllers } from "./academicSemester.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { academicSemesterValidationSchema, updateAcademicSemesterValidationSchema } from "./academicSemester.validation";

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