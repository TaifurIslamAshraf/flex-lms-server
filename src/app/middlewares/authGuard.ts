import httpStatus from "http-status";
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config/config';
import ApiError from "../errorHandlers/ApiError";
import catchAsync from "../utilities/catchAsync";
import { UserModel } from "../modules/userManagement/user/user.model";
import { TUserRole } from "../modules/userManagement/user/user.interface";


const authGuard = (...requiredRolls: TUserRole[]) => {
    return catchAsync(async (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1]

        if (!token) {
            throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!")
        }

        const decode = jwt.verify(token, config.token_data.access_token_secret as string) as JwtPayload
        const { userId, role, iat } = decode
        const user = await UserModel.isUserExistByCustomId(userId)

        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, "User not found!")
        }

        if (user.isDeleted || user.status === "blocked") {
            throw new ApiError(httpStatus.FORBIDDEN, `This user is ${user.isDeleted && "deleted" || user.status}`)
        }

        // console.log(decode)
        if (requiredRolls && !requiredRolls.includes(role)) {
            throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!")
        }

        const passwordChangeTime = user.passwordChangeAt
        if (passwordChangeTime && UserModel.isJwtIssuedAfterChangedPassword(passwordChangeTime, iat as number)) {
            throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!")
        }

        req.user = decode as JwtPayload
        next()
    })
}

export default authGuard