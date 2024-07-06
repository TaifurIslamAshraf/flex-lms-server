import ApiError from "../../errorHandlers/ApiError";
import { deleteFile } from "../../helper/deleteFile";
import { ILayout } from "./layout.inteface";
import LayoutModel from "./layout.model";

const createLayoutIntodb = async (payload: ILayout): Promise<ILayout> => {
  const layouts = await LayoutModel.countDocuments();
  if (layouts < 0) {
    payload.selected = true;
  }

  return await LayoutModel.create(payload);
};

const getLayoutFromdb = async (): Promise<ILayout[]> => {
  const layouts = await LayoutModel.find().sort({ selected: -1 });
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
  payload: Partial<ILayout>,
  id: string
): Promise<ILayout> => {
  if (payload.selected) {
    await unselectCurrentLayout();
  }

  const layout = await LayoutModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!layout) {
    throw new ApiError(404, "Layout not found");
  }

  return layout;
};

const deleteLayoutFromdb = async (id: string) => {
  const layout = await LayoutModel.findById(id);

  if (!layout) {
    throw new ApiError(404, "Layout not found");
  }
  if (layout.selected) {
    throw new ApiError(401, "Not Able to Delete Selected Layout");
  }

  await LayoutModel.findByIdAndDelete(id, {
    new: true,
    runValidators: true,
  });

  await deleteFile(layout.image);
};

const unselectCurrentLayout = async () => {
  await LayoutModel.findOneAndUpdate({ selected: true }, { selected: false });
};

export const layoutServices = {
  createLayoutIntodb,
  getLayoutFromdb,
  updateLayoutIntodb,
  deleteLayoutFromdb,
  getLayoutById,
};
