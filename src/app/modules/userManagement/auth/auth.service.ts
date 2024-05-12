import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";

import { UserModel } from "../user/user.model";
import { TPasswordData, TUserLogin } from "./auth.interface";
import { createToken, verifyToken } from "./auth.utils";
import ApiError from "../../../errorHandlers/ApiError";
import config from "../../../config/config";

const loginUserDB = async (payload: TUserLogin) => {
   
    const { id, password } = payload
    const user = await UserModel.isUserExistByCustomId(id)
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found!")
    }

    if (user.isDeleted || user.status === "blocked") {
        throw new ApiError(httpStatus.FORBIDDEN, `This user is ${user.isDeleted && "deleted" || user.status}`)
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password)
    if (!isPasswordMatched) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Password does not match!")
    }

    const jwtPayload = { userId: user.id, role: user.role }
    const accessToken = createToken(
        jwtPayload,
        config.token_data.access_token_secret as string,
        config.token_data.access_token_expires as string
    )

    const refreshToken = createToken(
        jwtPayload,
        config.token_data.refresh_token_secret as string,
        config.token_data.admin_staff_refresh_token_expires as string
    )

    return { accessToken, refreshToken, needsPasswordChange: user.needsPasswordChange }
}

const changePasswordIntoDB = async (userData: JwtPayload, payload: TPasswordData) => {

    const { oldPassword, newPassword } = payload
    const { userId, role } = userData
    const user = await UserModel.isUserExistByCustomId(userId)
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found!")
    }

    if (user.isDeleted || user.status === "blocked") {
        throw new ApiError(httpStatus.FORBIDDEN, `This user is ${user.isDeleted && "deleted" || user.status}`)
    }
    const isPasswordMatched = await bcrypt.compare(oldPassword, user.password)
    if (!isPasswordMatched) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Password does not match!")
    }

    const hashingPass = await bcrypt.hash(newPassword, Number(12))

    const result = await UserModel.findOneAndUpdate(
        { id: userId, role: role },
        { password: hashingPass, needsPasswordChange: false, passwordChangeAt: new Date() },
        { new: true }
    )

    return result
}

const refreshTokenService = async (token: string) => {
    const decode = verifyToken(token, config.token_data.refresh_token_secret as string)
    const { userId, iat } = decode
    const user = await UserModel.isUserExistByCustomId(userId)

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found!")
    }

    if (user.isDeleted || user.status === "blocked") {
        throw new ApiError(httpStatus.FORBIDDEN, `This user is ${user.isDeleted && "deleted" || user.status}`)
    }



    const passwordChangeTime = user.passwordChangeAt
    if (passwordChangeTime && UserModel.isJwtIssuedAfterChangedPassword(passwordChangeTime, iat as number)) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!")
    }

    const jwtPayload = { userId: user.id, role: user.role }
    const accessToken = createToken(
        jwtPayload,
        config.token_data.access_token_secret as string,
        config.token_data.access_token_expires as string
    )

    return accessToken
}

const forgetPassword = async (id: string, url: string) => {

    const user = await UserModel.isUserExistByCustomId(id)
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found!")
    }

    if (user.isDeleted || user.status === "blocked") {
        throw new ApiError(httpStatus.FORBIDDEN, `This user is ${user.isDeleted && "deleted" || user.status}`)
    }

    const jwtPayload = { userId: user.id, role: user.role }
    const resetToken = createToken(
        jwtPayload,
        config.token_data.access_token_secret as string,
        "10m"
    )
    const refreshToken = createToken(
        jwtPayload,
        config.token_data.refresh_token_secret as string,
        config.token_data.admin_staff_refresh_token_expires as string
    )

    const generatedLink1 = `http//:flexsoftr.com?id=${id}&token=${resetToken}`
    // const generatedLink1 = `${config.reset_password_ui_link}?id=${id}&token=${resetToken}`

    const generatedLink2 = `${url}&token=${resetToken}`

    // sendEmail(user.email, generatedLink1)

    return { generatedLink1, generatedLink2, refreshToken }
}

const resetPassword = async (payload: { id: string, newPassword: string }, token: string) => {

    const { id, newPassword } = payload
    const user = await UserModel.isUserExistByCustomId(id)
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found!")
    }

    if (user.isDeleted || user.status === "blocked") {
        throw new ApiError(httpStatus.FORBIDDEN, `This user is ${user.isDeleted && "deleted" || user.status}`)
    }

    const decode = verifyToken(token, config.token_data.access_token_secret as string)

    if (id !== decode.userId) {
        throw new ApiError(httpStatus.FORBIDDEN, "You are forbidden!")
    }

    // const hashingPass = await bcrypt.hash(newPassword, Number(config.saltRounds))
    const hashingPass = await bcrypt.hash(newPassword, Number(12))

    const result = await UserModel.findOneAndUpdate(
        { id, role: decode.role },
        { password: hashingPass, needsPasswordChange: false, passwordChangeAt: new Date() },
        { new: true })

    return result
}

export const authServices = { loginUserDB, changePasswordIntoDB, refreshTokenService, forgetPassword, resetPassword }