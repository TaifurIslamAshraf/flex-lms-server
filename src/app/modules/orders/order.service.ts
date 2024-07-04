import httpStatus from "http-status";
import { Types } from "mongoose";
import ApiError from "../../errorHandlers/ApiError";
import { AggregateQueryHelper } from "../../helper/query.helper";
import { cartServices } from "../cart/cart.service";
import { courseEngagementServices } from "../courseEngagement/courseEngagement.service";
import courseModel from "../courseManagement/course.model";
import { Order } from "./order.interface";
import orderModel from "./order.model";

const createOrderIntodb = async (payload: Order, userId: string) => {
  const courseIds = payload.items.map((item) => item.course.toString());

  // if course alredy purchased
  await courseEngagementServices.isPurchasedCourses(userId, payload.items);

  //if course alredy order
  await cartServices.isCourseAllredyOrder(userId, courseIds);

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

  aggregatePipeline
    .lookup({
      from: "users",
      localField: "user",
      foreignField: "_id",
      as: "userInfo",
    })
    .unwind({
      path: "$userInfo",
      preserveNullAndEmptyArrays: true,
    })
    .project({
      _id: 1,
      accountType: 1,
      orderStatus: 1,
      phone: 1,
      items: 1,
      orderedAt: 1,
      "userInfo.name": 1,
      "userInfo.email": 1,
    });

  const data = await aggregateHelper.model.exec();
  const meta = await aggregateHelper.metaData();

  return { data, meta };
};

const getOrderById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Order id is invalid");
  }

  const order = await orderModel.findById(id).populate([
    {
      path: "items.course",
      select: "name _id",
    },
    {
      path: "user",
      select: "name _id",
    },
  ]);

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

    await updatePurchasedHistory(courseEngagementPayload?.course);
  }

  return order;
};

const updatePurchasedHistory = async (courseIds: Types.ObjectId[]) => {
  const courses = await courseModel.find({
    _id: { $in: courseIds },
  });

  await Promise.all(
    courses?.map((course) => {
      course.purchased = (course?.purchased || 0) + 1;
      return course.save();
    })
  );
};

export const orderServices = {
  createOrderIntodb,
  getAllOrdersFromdb,
  getOrderById,
  updateOrderStatusFromdb,
  updatePurchasedHistory,
};
