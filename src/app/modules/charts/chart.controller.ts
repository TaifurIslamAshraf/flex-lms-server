import catchAsync from "../../utilities/catchAsync";
import sendResponse from "../../utilities/sendResponse";
import { cahrtService } from "./chart.service";

const getSealesReport = catchAsync(async (req, res) => {
  const currentDate = new Date();
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
  const endOfYear = new Date(currentDate.getFullYear() + 1, 0, 1);

  const result = await cahrtService.getSealesReportFromdb(
    startOfYear,
    endOfYear,
    currentDate
  );

  sendResponse(res, {
    statusCode: 200,
    message: "Order Trends data",
    data: result,
  });
});

const getOverView = catchAsync(async (req, res) => {
  const result = await cahrtService.getOverViewFromdb();

  sendResponse(res, {
    statusCode: 200,
    message: "Dashboard overview",
    data: result,
  });
});

const getOrderStatus = catchAsync(async (req, res) => {
  const result = await cahrtService.getOrderStatusFromdb();

  sendResponse(res, {
    statusCode: 200,
    message: "Order status overview",
    data: result,
  });
});

export const chartController = {
  getSealesReport,
  getOverView,
  getOrderStatus,
};
