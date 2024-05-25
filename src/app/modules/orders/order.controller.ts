import httpStatus from "http-status";
import catchAsync from "../../utilities/catchAsync";
import sendResponse from "../../utilities/sendResponse";
import { IOrder, Order } from "./order.interface";
import { orderServices } from "./order.service";

//create order
const createOrder = catchAsync(async (req, res) => {
  const { accountNumber, accountType, items, transactionId } =
    req.body as IOrder;

  const payload: Order = {
    accountNumber,
    accountType,
    items,
    transactionId,
    user: res.locals.user?._id,
  };

  const result = await orderServices.createOrderIntodb(payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Order was created successfully",
    data: result,
  });
});

//get all orders
const getAllOrders = catchAsync(async (req, res) => {
  const query = req.query;

  const result = await orderServices.getAllOrdersFromdb(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "all orders here",
    data: result,
  });
});

//get single orders
const getSingleOrders = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await orderServices.getOrderById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: result,
  });
});

//update order status
const updateOrderStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body;

  const result = await orderServices.updateOrderStatusFromdb(id, orderStatus);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Order status updated successfully",
    data: result,
  });
});

//delete order
const deleteOrder = catchAsync(async (req, res) => {
  const { id } = req.params;

  const order = await orderServices.getOrderById(id);

  await order.deleteOne();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Order delete successfully",
  });
});

export const orderControllers = {
  createOrder,
  getAllOrders,
  getSingleOrders,
  updateOrderStatus,
  deleteOrder,
};
