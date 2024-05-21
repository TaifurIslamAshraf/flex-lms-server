import httpStatus from "http-status";
import ApiError from "../../../errorHandlers/ApiError";
import catchAsync from "../../../utilities/catchAsync";
import sendResponse from "../../../utilities/sendResponse";
import { authServices } from "../auth/auth.service";
import { IUserUpdate } from "./user.interface";
import { userService } from "./user.service";

//get me
const getUserInfo = catchAsync(async (req, res) => {
  const userId = res.locals.user._id;
  const user = await authServices.userFindById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: user,
  });
});

//update avatar
const updateUserAvatar = catchAsync(async (req, res) => {
  const userId = res.locals.user._id;

  const user = await userService.updateUserAvatarIntodb(req?.file, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User avatar updated successfull",
    data: user,
  });
});

//update user info
const updateUserInfo = catchAsync(async (req, res) => {
  const {
    name,
    phone,
    address,
    fatherName,
    motherName,
    instructor,
    district,
    postCode,
  } = req.body;
  if (req.body.email) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You can not update you email");
  }

  const userId = res.locals.user._id;
  const payload: IUserUpdate = {
    name,
    phone,
    address,
    fatherName,
    motherName,
    instructor,
    district,
    postCode,
  };

  const user = await userService.updateUserIntodb(payload, userId);

  sendResponse(res, {
    success: true,
    message: "User info update successfull",
    data: user,
    statusCode: httpStatus.OK,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await userService.getAllUserFromdb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "All user here",
    data: result,
  });
});

const updateUserRole = catchAsync(async (req, res) => {
  const { userId, role } = req.body;

  const result = await userService.userRoleService(userId, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User role update successfully",
    data: result,
  });
});

export const userControllers = {
  getUserInfo,
  updateUserAvatar,
  updateUserInfo,
  getAllUsers,
  updateUserRole,
};
