import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { academicSemesterServices } from "./academicSemester.service";
import catchAsync from "../../utils/catchAsync";

const createAcademicSemester = catchAsync(async (req, res) => {
    const result = await academicSemesterServices.createAcademicSemesterIntoDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Academic semester is created successfully",
        data: result
    })
})

const getAcademicSemester = catchAsync(async (req, res) => {
    const result = await academicSemesterServices.getAcademicSemesterFromDB(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Academic semester is fetched successfully",
        data: result
    })
})

const updateAcademicSemester = catchAsync(async (req, res) => {
    const result = await academicSemesterServices.updateAcademicSemesterIntoDB(req.params.id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Academic semester was updated successfully",
        data: result
    })
})

const getAllAcademicSemester = catchAsync(async (req, res) => {
    const result = await academicSemesterServices.getAllAcademicSemesterFromDB();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "All Academic semesters is fetched successfully",
        data: result
    })
})

export const academicSemesterControllers = { createAcademicSemester, getAcademicSemester, updateAcademicSemester, getAllAcademicSemester }