import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utilities/catchAsync";
import sendResponse from "../../../utilities/sendResponse";
import { IUser } from "./auth.interface";
import { authServices } from "./auth.service";
import { sendToken } from "./auth.utils";

//register user
export const registerUser = catchAsync(async (req: Request, res: Response) => {
  //get user data form body
  const { name, email, password, phone } = req.body as IUser;

  const payload = {
    name,
    email,
    password,
    phone,
  };

  const result = await authServices.createUserIntodb(payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "user create successfully",
    data: result,
  });
});

//login user
export const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await authServices.loginService({ email, password });

  sendToken(result, 200, res);
});
