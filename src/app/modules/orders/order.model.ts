import { Model, Schema, model } from "mongoose";
import { IOrder } from "./order.interface";

const orderSchema = new Schema<IOrder>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  accountType: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },

  orderStatus: {
    type: String,
    enum: ["Approved", "Pending", "Rejected"],
    default: "Pending",
  },

  orderedAt: {
    type: Date,
    default: Date.now,
  },

  items: [
    {
      course: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
});

const orderModel: Model<IOrder> = model("Order", orderSchema);

export default orderModel;
