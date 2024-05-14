import { Types } from "mongoose";

export type IOrder = {
  user: Types.ObjectId;
  course: Types.ObjectId;
  orderedAt: Date;
} & Document;
