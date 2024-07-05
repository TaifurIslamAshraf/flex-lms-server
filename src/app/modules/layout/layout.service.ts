import ApiError from "../../errorHandlers/ApiError";
import { ILayout } from "./layout.inteface";
import LayoutModel from "./layout.model";

const createLayoutIntodb = async (payload: ILayout): Promise<ILayout> => {
  return await LayoutModel.create(payload);
};

const getLayoutFromdb = async (selected?: string): Promise<ILayout[]> => {
  const isSelected = Boolean(selected);

  const layouts = await LayoutModel.find({ selected: isSelected });
  if (layouts.length < 0) {
    throw new ApiError(404, "Layout Not Found");
  }

  return layouts;
};

const getLayoutById = async (id: string): Promise<ILayout> => {
  const layout = await LayoutModel.findById(id);
  if (!layout) {
    throw new ApiError(404, "Layout Not Found");
  }

  return layout;
};

const updateLayoutIntodb = async (
  payload: Record<string, unknown>,
  id: string
): Promise<ILayout> => {
  const layout = await LayoutModel.findByIdAndUpdate(id, payload);
  if (!layout) {
    throw new ApiError(404, "Layout not found");
  }

  return layout;
};

const deleteLayoutFromdb = async (id: string) => {
  const layout = await LayoutModel.findByIdAndDelete(id, {
    runValidators: true,
    new: true,
  });

  if (!layout) {
    throw new ApiError(404, "Layout not found");
  }
};

export const layoutServices = {
  createLayoutIntodb,
  getLayoutFromdb,
  updateLayoutIntodb,
  deleteLayoutFromdb,
  getLayoutById,
};
