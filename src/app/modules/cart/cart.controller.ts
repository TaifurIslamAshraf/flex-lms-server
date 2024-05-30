import httpStatus from "http-status";
import catchAsync from "../../utilities/catchAsync";
import sendResponse from "../../utilities/sendResponse";
import { cartServices } from "./cart.service";

const addToCart = catchAsync(async (req, res) => {
  const userId = res.locals?.user?._id;
  const courseId = req.body.courseId;

  const result = await cartServices.addToCartFromdb(userId, courseId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Course added into cart",
    data: result,
  });
});

const removeFromCart = catchAsync(async (req, res) => {
  const userId = res.locals?.user?._id;
  const courseId = req.body.courseId;

  const result = await cartServices.removeFromCartIntodb(userId, courseId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Course remove from cart",
    data: result,
  });
});

export const cartControllers = { addToCart, removeFromCart };
