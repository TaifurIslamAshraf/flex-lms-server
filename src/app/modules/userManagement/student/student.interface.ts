import { Model, Types } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
export type TUserName = {
    firstName: string;
    middleName?: string;
    lastName: string
}

export type TGuardian = {
    fatherName: string;
    fatherOccupation: string;
    fatherContactNo: string;
    motherName: string;
    motherOccupation: string;
    motherContactNo: string;
}

export type TStudent = {
    id: string;
    user: Types.ObjectId;
    name: TUserName;
    email: string;
    gender: 'Male' | 'Female';
    dateOfBirth: Date;
    contactNo: string;
    bloodGroup: 'A' | 'B' | 'AB' | 'O' | 'Rh+ ' | 'Rh-';
    presentAddress: string;
    permanentAddress: string;
    guardian: TGuardian;
    admissionSemester: Types.ObjectId;
    academicDepartment: Types.ObjectId;
    academicFaculty: Types.ObjectId;
    profileImg?: string;
    isDeleted: boolean;
}

//for creating instance methods
// export type TStudentMethods = {
//     isUserExist(id: string): Promise<TStudent | null> // custom method declaration
// }

// export type TStudentModel = Model<TStudent, Record<string, never>, TStudentMethods>;


// for creating static
export interface TStudentModel extends Model<TStudent> {
    isUserExist(id: string): Promise<TStudent | null>
}