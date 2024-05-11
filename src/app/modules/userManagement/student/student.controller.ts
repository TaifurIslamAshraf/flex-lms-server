import { studentService } from "./student.service"
import sendResponse from "../../utils/sendResponse"
import catchAsync from "../../utils/catchAsync"
import mongoose from "mongoose"

const getAllStudents = catchAsync(async (req, res) => {
    const result = await studentService.getAllStudentsFromDB(req.query)
    sendResponse(res, {
        message: 'All students data',
        data: result
    })
})

const getSingleStudents = catchAsync(async (req, res) => {
    const { id } = req.params
    const result = await studentService.getSingleStudentFromDB(id)
    sendResponse(res, {
        message: 'Single student data retrieved successfully',
        data: result
    })
})
const updateStudent = catchAsync(async (req, res) => {
    const { id } = req.params
    const result = await studentService.updateStudentIntoDB(id, req.body.student)
    sendResponse(res, {
        message: 'Student data updated successfully',
        data: result
    })
})
const deleteAStudent = catchAsync(async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const { id } = req.params
        const result = await studentService.deleteAStudentFromDB(id, session)
        sendResponse(res, {
            message: 'Delete student successfully',
            data: result
        })
        await session.commitTransaction()
    } catch (error) {
        console.log(error)
        await session.abortTransaction()
        next(error)
    } finally {
        await session.endSession()
    }
})

export const studentController = { getAllStudents, getSingleStudents, updateStudent, deleteAStudent }