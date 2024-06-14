import httpStatus from "http-status";
import { Types } from "mongoose";
import ApiError from "../../errorHandlers/ApiError";
import { AggregateQueryHelper } from "../../helper/query.helper";
import { cartServices } from "../cart/cart.service";
import { courseEngagementServices } from "../courseEngagement/courseEngagement.service";
import { Order } from "./order.interface";
import orderModel from "./order.model";

const createOrderIntodb = async (payload: Order, userId: string) => {
  await courseEngagementServices.isPurchasedCourses(userId, payload.items);

  const order = await orderModel.create(payload);
  await cartServices.clearCartIntodb(userId);

  return order;
};

const getAllOrdersFromdb = async (query: Record<string, unknown>) => {
  const aggregatePipeline = orderModel.aggregate();

  const aggregateHelper = new AggregateQueryHelper(
    aggregatePipeline,
    query,
    orderModel
  );

  aggregateHelper.filterByOrderStatus().paginate();

  const data = await aggregateHelper.model;
  const meta = await aggregateHelper.metaData();

  return { data, meta };
};

const getOrderById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Order id is invalid");
  }

  const order = await orderModel.findById(id);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  return order;
};

const updateOrderStatusFromdb = async (
  orderId: string,
  orderStatus: "Approved" | "Pending" | "Rejected"
) => {
  const order = await getOrderById(orderId);

  if (order.orderStatus === "Approved") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Order alredy approved");
  }

  order.orderStatus = orderStatus;

  await order.save();

  if (orderStatus === "Approved") {
    const courseEngagementPayload = {
      user: order.user,
      course: order.items.map((item) => item.course),
    };

    await courseEngagementServices.createCourseEngagementIntodb(
      courseEngagementPayload
    );
  }

  return order;
};

export const orderServices = {
  createOrderIntodb,
  getAllOrdersFromdb,
  getOrderById,
  updateOrderStatusFromdb,
};
