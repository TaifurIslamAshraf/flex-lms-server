import httpStatus from "http-status";
import mongoose from "mongoose";
import QueryBuilder from '../../builder/QueryBuilder';
import ApiError from "../../errors/ApiError";
import { UserModel } from "../user/user.model";
import { searchableFields } from './student.constant';
import { TStudent } from './student.interface';
import StudentModel from "./student.model";

const getSingleStudentFromDB = async (_id: string) => {
    const result = await StudentModel.findById(_id).populate('admissionSemester').populate(['admissionSemester', 'user']).populate({
        path: 'academicDepartment',
        populate: {
            path: 'academicFaculty'
        }
    })
    return result
}

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
    // const queryObj = { ...query }

    // let searchValue = ''
    // if (query?.search) {
    //     searchValue = query.search as string;
    // }

    // const fields = ["name.lastName", "name.firstName", "email", "gender"];
    // const searchConditions = fields.map((field) => ({
    //     [field]: { $regex: new RegExp(searchValue, 'i') } //{ name: { $regex: searchValue, $options: 'i' } }
    // }));

    // const searchQuery = StudentModel.find(
    //     { $or: searchConditions }
    // )

    // // filtering

    // excludeFields.forEach(el => delete queryObj[el])

    // console.log(query, queryObj)
    // const filterQuery = searchQuery.find(
    //     queryObj
    // ).populate(['admissionSemester', 'user']).populate(
    //     {
    //         path: 'academicDepartment',
    //         populate: {
    //             path: 'academicFaculty'
    //         }
    //     }
    // )

    // let sort = '-createdAt'
    // if (query.sort) {
    //     sort = query.sort as string
    // }
    // const sortQuery = filterQuery.sort(sort)

    // let limit = 1
    // if (query.limit) {
    //     limit = Number(query.limit)
    // }

    // let page = 1
    // let skip = 0
    // if (query.page) {
    //     page = Number(query.page)
    //     skip = (page - 1) * limit
    // }

    // const paginateQuery = sortQuery.skip(skip)

    // const limitQuery = paginateQuery.limit(limit)

    //fields limiting
    // let fieldQuery = "-__v"
    // if (query.fields) {
    //     fieldQuery = (query.fields as string).split(',').join(' ')
    // }
    // console.log(fieldQuery)
    // const fieldsLimitingQuery = await limitQuery.select(fieldQuery)

    // return fieldsLimitingQuery

    const studentQuery = new QueryBuilder(
        StudentModel.find().populate(['admissionSemester', 'user']).populate(
            {
                path: 'academicDepartment',
                populate: {
                    path: 'academicFaculty'
                }
            }
        ),
        query
    ).search(searchableFields).filter().sort().paginate().fields()

    const result = await studentQuery.queryModel
    const meta = await studentQuery.countTotal()
    console.log(meta)
    return { meta, result }

}

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
    const { name, guardian, ...remainingData } = payload

    const modifiedUpdatedData: Record<string, unknown> = { ...remainingData }

    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modifiedUpdatedData[`name.${key}`] = value
        }
    }

    if (guardian && Object.keys(guardian).length) {
        for (const [key, value] of Object.entries(guardian)) {
            modifiedUpdatedData[`guardian.${key}`] = value
        }
    }

    console.log({ ...payload }, 'modifiedUpdatedData', modifiedUpdatedData)

    const result = await StudentModel.findByIdAndUpdate(
        id,
        { ...modifiedUpdatedData },
        { new: true, runValidators: true }
    )
    return result
}

const deleteAStudentFromDB = async (id: string, session: mongoose.ClientSession) => {

    const isUserExist = await StudentModel.isUserExist(id)
    if (!isUserExist) {
        throw new ApiError(404, 'Student not found!')
    }
    const deletedStudent = await StudentModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true, session })

    if (!deletedStudent) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Failed to delete student!")
    }

    const deletedUser = await UserModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true, session })

    if (!deletedUser) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Failed to delete user!")
    }
    return deletedStudent
}

export const studentService = { getAllStudentsFromDB, getSingleStudentFromDB, updateStudentIntoDB, deleteAStudentFromDB }