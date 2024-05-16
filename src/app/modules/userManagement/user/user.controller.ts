import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utilities/catchAsync";
import sendResponse from "../../../utilities/sendResponse";
import { IUser } from "./user.interface";
import { userServices } from "./user.service";

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

  const result = await userServices.createUserIntodb(payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "user create successfully",
    data: result,
  });
});
