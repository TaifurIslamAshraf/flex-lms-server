import { Schema, model } from "mongoose";
import { TGuardian, TStudent, TStudentModel, TUserName } from "./student.interface";
// import { TGuardian, TStudent, TStudentMethods, TStudentModel, TUserName } from "./student.interface";
import validator from "validator";
// import bcrypt from "bcrypt";
// import config from "../../config/config";

const userNameSchema = new Schema<TUserName>(
    {
        firstName: { // do not need validation here , as we are using joy validation library.
            type: String,
            // required: [true, "First Name is required!"],
            // trim: true,
            // maxlength: [20, 'First Name can not be longer than 20 character.'],
            // validate: {
            //     validator: function (v: string) {
            //         const firstNameStr = v.charAt(0).toUpperCase() + v.slice(1)
            //         return v === firstNameStr
            //     },
            //     message: '{VALUE} is not valid data'
            // }
        },
        middleName: { type: String },
        lastName: {
            type: String,
            required: [true, 'Last Name is required!'],
            trim: true,
            maxlength: [20, 'First Name can not be longer than 20 character.'],
            validate: {
                validator: (value: string) => validator.isAlpha(value),
                message: '{VALUE} is not valid.'
            }
        }
    }
)

const guardianSchema = new Schema<TGuardian>(
    {
        fatherName: {
            type: String
        },
        fatherOccupation: {
            type: String
        },
        fatherContactNo: {
            type: String
        },
        motherName: {
            type: String
        },
        motherContactNo: {
            type: String
        },
        motherOccupation: {
            type: String
        },
    }
)

// const studentSchema = new Schema<TStudent, TStudentModel, TStudentMethods>({ // for instance method
const studentSchema = new Schema<TStudent, TStudentModel>({
    id: { type: String, required: true, unique: true },
    user: {
        type: Schema.Types.ObjectId,
        required: [true, "Name is required!"],
        unique: true,
        ref: "User"
    },
    name: {
        type: userNameSchema, required: [true, "Name is required!"]
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        unique: true,
    },
    gender: {
        type: String,
        enum: {
            values: ["Male", "Female"],
            message: "{VALUE} is not valid.The gender can only be Male or Female"
        },
        required: true
    },
    dateOfBirth: { type: Date },
    contactNo: {
        type: String,
        unique: true,
        required: [true, 'Contact number is required!']
    },
    bloodGroup: {
        type: String, enum: ['A', 'B', 'AB', 'O', 'Rh+ ', 'Rh-'],
    },
    presentAddress: { type: String },
    permanentAddress: { type: String },
    guardian: { type: guardianSchema, required: true },
    admissionSemester: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Academic-semester'
    },
    academicDepartment: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Academic-department',
    },
    academicFaculty: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Academic-faculty',
    },
    profileImg: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false }
},
    // {
    //     toJSON: {
    //         virtuals: true
    //     }
    // }
)
//document middleware
//mongoose pre middleware/hook named 'save' // This will work/run before save data in database
// studentSchema.pre('save', async function (next) {
//     const hashingPass = await bcrypt.hash(this.password, Number(config.saltRounds))
//     this.password = hashingPass // before save in database password is being hashed
//     next()
// })
//mongoose "post middleware/hook" named 'save' // It will work/run after save data in database
// studentSchema.post('save', function (doc, next) {
//     doc.password = ""
//     next()
// })

// query middleware
// studentSchema.pre('find', function (next) { // this executes before the actual find query
// console.log("Thissssssssssssssssssssssssssssssssss", this)
//     this.find({ isDeleted: { $ne: true } })
//     next()
// })
// studentSchema.pre('findOne', function (next) { // this executes before the actual find query
//     this.find({ isDeleted: { $ne: true } })
//     next()
// })
// studentSchema.pre('aggregate', function (next) { // this executes before the actual find query
//     this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } })
//     next()
// })

// // mongoose virtual
// studentSchema.virtual('FullName').get(function () {
//     return this.name.firstName + ' ' + this.name.middleName + ' ' + this.name.lastName
// })

//custom instance method
// studentSchema.methods.isUserExist = async function (id: string) {
//     const exitingUser = await StudentModel.findOne({ id }) //custom instance method creation
//     return exitingUser
// }

// const StudentModel = model<TStudent, TStudentModel>('Student', studentSchema) // in case of instance method


// create custom static methods
studentSchema.statics.isUserExist = async function (id: string) {
    const exitingUser = await StudentModel.findOne({ id }) //custom static method creation
    return exitingUser
}
const StudentModel = model<TStudent, TStudentModel>('Student', studentSchema)

export default StudentModel