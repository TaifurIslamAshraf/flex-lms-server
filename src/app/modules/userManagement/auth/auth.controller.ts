import httpStatus from "http-status";
import config from "../../config/config";
import ApiError from "../../errors/ApiError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {
    const result = await authServices.loginUserDB(req.body)
    const { refreshToken, accessToken } = result

    // Set refresh token as an HTTP-only cookie
    res.cookie(
        'refreshToken',
        refreshToken,
        { secure: config.NODE_ENV === "production", httpOnly: true }
    );

    // Set access token as an HTTP-only cookie
    res.cookie(
        'accessToken',
        accessToken,
        { secure: config.NODE_ENV === "production", httpOnly: true }
    );

    sendResponse(res, {
        message: "User is successfully logged!",
        data: result
    })
})

const changePassword = catchAsync(async (req, res) => {
    const userData = req.user
    const passwordData = req.body
    const result = await authServices.changePasswordIntoDB(userData, passwordData)
    sendResponse(res, {
        message: "Password was successfully updated!",
        data: result
    })
})

const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies
    const result = await authServices.refreshTokenService(refreshToken)
    sendResponse(res, {
        message: "Access token is successfully retrieved!",
        data: result
    })
})

const forgetPassword = catchAsync(async (req, res) => {
    const userId = req.body.id
    const url = `${req.protocol}://${req.get('host')}?id=${userId}`
    const result = await authServices.forgetPassword(userId, url)

    sendResponse(res, {
        message: "Email sent with reset link!",
        data: result
    })
})

const resetPassword = catchAsync(async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Yor are not authorized!")
    }
    const result = await authServices.resetPassword(req.body, token)

    sendResponse(res, {
        message: "Password reset successfully!",
        data: result
    })
})

export const authControllers = {
    loginUser, changePassword, refreshToken, forgetPassword, resetPassword
}