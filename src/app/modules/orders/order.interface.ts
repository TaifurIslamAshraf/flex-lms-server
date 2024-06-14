import { Types } from "mongoose";

export type IOrder = {
  user: Types.ObjectId;
  accountType: string;
  accountNumber: string;
  transactionId: string;
  phone: string;
  orderStatus: "Approved" | "Pending" | "Rejected";
  orderedAt: Date;
  items: {
    course: Types.ObjectId;
    price: number;
  }[];
} & Document;

export type Order = Pick<
  IOrder,
  "user" | "accountNumber" | "accountType" | "transactionId" | "items" | "phone"
>;
