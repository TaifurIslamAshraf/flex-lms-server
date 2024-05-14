import { Model, Schema, model } from "mongoose";
import { IOrder } from "./order.interface";

const orderSchema = new Schema<IOrder>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  orderedAt: {
    type: Date,
    default: Date.now,
  },
});

const Order: Model<IOrder> = model("Order", orderSchema);

export default Order;
