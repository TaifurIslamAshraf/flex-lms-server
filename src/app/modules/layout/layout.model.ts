import { Model, Schema, model } from "mongoose";
import { ILayout } from "./layout.inteface";

const layoutSchema = new Schema<ILayout>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },

  selected: {
    type: Boolean,
    default: false,
  },
});

const LayoutModel: Model<ILayout> = model("Layout", layoutSchema);
export default LayoutModel;
