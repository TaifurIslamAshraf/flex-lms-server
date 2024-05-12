import httpStatus from "http-status";
import { Schema, model } from "mongoose";

import { TAcademicSemester, TMonths, TSemesterCodes, TSemesterNames } from "./academicSemester.interface";
import ApiError from "../../errorHandlers/ApiError";

export const Months: TMonths[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const SemesterNames: TSemesterNames[] = ["Autumn", "Summer", "Fall"]
export const SemesterCodes: TSemesterCodes[] = ["01", "02", "03"]

const academicSemesterSchema = new Schema<TAcademicSemester>(
    {
        name: { type: String, required: true, enum: SemesterNames },
        code: { type: String, required: true, enum: SemesterCodes },
        year: { type: String, required: true },
        startMonth: { type: String, required: true, enum: Months },
        endMonth: { type: String, required: true, enum: Months },
    },
    { timestamps: true }
)

academicSemesterSchema.pre('save', async function (next) {
    const isSemesterExist = await AcademicSemesterModel.findOne({
        name: this.name,
        year: this.year
    })
    if (isSemesterExist) {
        throw new ApiError(httpStatus.OK, 'Semester is already exist!')
    } else {
        next()
    }
})

const AcademicSemesterModel = model<TAcademicSemester>('Academic-semester', academicSemesterSchema)

export { AcademicSemesterModel };
