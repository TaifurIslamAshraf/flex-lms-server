import bcrypt from 'bcrypt';
import { Schema, model } from "mongoose";
// import config from "../../../config/config";
import { TUser, TUserModel } from "./user.interface";

const userSchema = new Schema<TUser, TUserModel>(
    {
        id: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: {
            type: String,
            required: true,
            select: 0 //skips this field
        },
        needsPasswordChange: { type: Boolean, default: true },
        passwordChangeAt: { type: Date },
        role: {
            type: String,
            enum: ["superAdmin", "admin", "student", "faculty"],
            default: 'student'
        },
        status: {
            type: String,
            enum: ["in-progress", "blocked"],
            default: "in-progress"
        },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
)

userSchema.pre('save', async function (next) {
    const hashingPass = await bcrypt.hash(this.password, Number(12))
    // const hashingPass = await bcrypt.hash(this.password, Number(config.saltRounds))
    this.password = hashingPass // before save in database password is being hashed
    next()
})

userSchema.statics.isUserExistByCustomId = async function (id: string) {
    return await UserModel.findOne({ id }).select("+password")
}

userSchema.statics.isJwtIssuedAfterChangedPassword = (passwordChangeTime, jwtIatTime) => {
    passwordChangeTime = new Date(passwordChangeTime).getTime() / 1000
    return passwordChangeTime > jwtIatTime
}

const UserModel = model<TUser, TUserModel>('User', userSchema)

export { UserModel };
