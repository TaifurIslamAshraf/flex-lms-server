import httpStatus from "http-status";
import { JwtPayload } from 'jsonwebtoken';
import mongoose from "mongoose";
// import config from "../../../config/config";
import { TAdmin } from "../admin/admin.interface";
import { Admin } from "../admin/admin.model";

import { TStudent } from "../student/student.interface";
import StudentModel from "../student/student.model";
import { USER_ROLL } from "./user.const";
import { TUser } from "./user.interface";
import { UserModel } from "./user.model";
import { generateAdminId, generateStudentId } from "./utils";
import ApiError from "../../../errorHandlers/ApiError";
import { AcademicSemesterModel } from "../../academicSemester/academicSemester.model";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createStudentIntoDB = async (file: any, password: string, payload: TStudent) => {
    // find academic department info
    // const academicDepartment = await AcademicDepartmentModel.findById(
    //     payload.academicDepartment,
    // );
    // if (!academicDepartment) {
    //     throw new ApiError(400, 'Academic department not found');
    // }
    // payload.academicFaculty = academicDepartment.academicFaculty
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const semester = await AcademicSemesterModel.findById({ _id: payload.admissionSemester })
        const createdId = await generateStudentId(semester?.year, semester?.code)
        const newUser = await UserModel.create([{ id: createdId, password, email: payload.email }], { session });

        if (!newUser.length) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user!')
        }

        // const filename = `${Date.now()}_${payload.name.firstName}`
        // if (file) {
        //     const imgLink = await sendImageToCloudinary(file.path, filename) as UploadApiResponse
        //     payload.profileImg = imgLink?.secure_url
        // }

        payload.id = newUser[0].id;
        payload.user = newUser[0]._id;

        const newStudent = await StudentModel.create([payload], { session });

        if (!newStudent.length) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create student!')
        }
        await session.commitTransaction();
        await session.endSession();
        return newStudent[0];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err);
    }

};


const createAdminIntoDB = async (password: string, payload: TAdmin) => {
    // create a user object
    const userData: Partial<TUser> = { email: payload.email };
    //if password is not given , use default password
    // userData.password = password || (config.default_password as string);
    //set student role
    userData.role = 'admin';

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        //set  generated id
        userData.id = await generateAdminId();

        // create a user (transaction-1)
        const newUser = await UserModel.create([userData], { session });

        //create a admin
        if (!newUser.length) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create admin');
        }
        // set id , _id as user
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id; //reference _id

        // create a admin (transaction-2)
        const newAdmin = await Admin.create([payload], { session });

        if (!newAdmin.length) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create admin');
        }

        await session.commitTransaction();
        await session.endSession();

        return newAdmin;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err);
    }
};

const getMeFromDB = async (user: JwtPayload) => {
    const { userId, role } = user
    let result = null
    if (role === USER_ROLL.student) {
        result = await StudentModel.findOne({ id: userId }).populate('user')
    }
    if (role === USER_ROLL.admin) {
        result = await Admin.findOne({ id: userId }).populate('user')
    }
  
    return result
};

const changeStatusIntoDB = async (_id: string, payload: Record<string, string>) => {
    const result = await UserModel.findByIdAndUpdate(_id, payload, { new: true })
    return result
};

export const userServices = { createStudentIntoDB, createAdminIntoDB, getMeFromDB, changeStatusIntoDB }