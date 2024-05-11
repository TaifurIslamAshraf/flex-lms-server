import { Model } from "mongoose";
import { USER_ROLL } from "./user.const";

export type TUser = {
    id: string,
    email: string;
    password: string,
    needsPasswordChange: boolean;
    passwordChangeAt?: Date;
    role: "superAdmin" | "admin" | "student" | "faculty";
    status: "in-progress" | "blocked";
    isDeleted: boolean;
}

export type TUserModel = {
    isUserExistByCustomId(id: string): Promise<TUser>,
    isJwtIssuedAfterChangedPassword(passwordChangeTime: Date, jwtIatTime: number): boolean
} & Model<TUser>

export type TUserRole = keyof typeof USER_ROLL