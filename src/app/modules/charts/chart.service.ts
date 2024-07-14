import courseModel from "../courseManagement/course.model";
import orderModel from "../orders/order.model";
import UserModel from "../userManagement/user/user.model";

const getSealesReportFromdb = async (
  startOfYear: Date,
  endOfYear: Date,
  currentDate: Date
) => {
  const yearlySales = await orderModel.aggregate([
    {
      $match: {
        deliveredAt: { $gte: startOfYear, $lt: endOfYear },
        orderStatus: "Approved",
      },
    },
    {
      $group: {
        _id: { month: { $month: "$deliveredAt" } },
        totalAmount: { $sum: { $sum: "$items.price" } },
      },
    },
  ]);

  const monthSales = Array.from({ length: 12 }, (_, monthIndex) => {
    const totalMonth = yearlySales?.find(
      (item) => item?._id?.month === monthIndex + 1
    );

    return {
      name: new Date(currentDate.getFullYear(), monthIndex, 1).toLocaleString(
        "en-us",
        { month: "long" }
      ),
      total: totalMonth ? totalMonth.totalAmount : 0,
    };
  });

  return monthSales;
};

const getOverViewFromdb = async () => {
  const totalSales = await orderModel.aggregate([
    {
      $match: { orderStatus: "Approved" },
    },
    {
      $unwind: "$items",
    },
    {
      $group: { _id: null, totalSales: { $sum: "$items.price" } },
    },
    { $project: { _id: 0, totalSales: 1 } },
  ]);
  const totalCourses = await courseModel.countDocuments();
  const totalUsers = await UserModel.countDocuments();

  return {
    totalSales: totalSales[0]?.totalSales || 0,
    totalCourses,
    totalUsers,
  };
};

const getOrderStatusFromdb = async () => {
  const startDate = new Date();
  startDate.setUTCHours(0, 0, 0, 0);
  const endDate = new Date();
  endDate.setUTCHours(23, 59, 59, 999);
  endDate.setMonth(startDate.getMonth() + 6);

  const orderStatus = await orderModel.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: "$orderStatus",
        count: { $sum: 1 },
      },
    },
  ]);

  return orderStatus;
};
export const cahrtService = {
  getSealesReportFromdb,
  getOverViewFromdb,
  getOrderStatusFromdb,
};
