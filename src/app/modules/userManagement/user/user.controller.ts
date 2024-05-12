import { RequestHandler } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utilities/catchAsync";
import sendResponse from "../../../utilities/sendResponse";
import { userServices } from "./user.service";

const createStudent: RequestHandler = async (req, res) => {
  const { password, student } = req.body;
  const result = await userServices.createStudentIntoDB(
    req.file,
    password,
    student
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Student is created successfully",
    data: result,
  });
};

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;
  const result = await userServices.createAdminIntoDB(password, adminData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin is created successfully",
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const result = await userServices.getMeFromDB(req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is retrieved successfully",
    data: result,
  });
});

const changeStatus = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await userServices.changeStatusIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Status is retrieved successfully",
    data: result,
  });
});

export const userControllers = {
  createStudent,
  createAdmin,
  getMe,
  changeStatus,
};
