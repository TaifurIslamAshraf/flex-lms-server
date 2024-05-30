import { Types } from "mongoose";

export type ICart = {
  cartItems: Types.ObjectId[] | [];
};
