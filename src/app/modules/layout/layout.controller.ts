import httpStatus from "http-status";
import ApiError from "../../errorHandlers/ApiError";
import catchAsync from "../../utilities/catchAsync";
import sendResponse from "../../utilities/sendResponse";
import { ILayout } from "./layout.inteface";
import { layoutServices } from "./layout.service";

const createLayout = catchAsync(async (req, res) => {
  const { title, description } = req.body;

  const payload: ILayout = {
    title,
    description,
    image: "",
  };

  const file = req.file as Express.Multer.File;
  if (!file) {
    throw new ApiError(401, "Image is Required");
  }

  payload.image = file.path;

  const layout = await layoutServices.createLayoutIntodb(payload);

  sendResponse(res, {
    data: layout,
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Layout created successfull",
  });
});

const getLayouts = catchAsync(async (req, res) => {
  const layouts = await layoutServices.getLayoutFromdb();

  sendResponse(res, {
    data: layouts,
    success: true,
    statusCode: httpStatus.OK,
    message: "All Layout successfull",
  });
});

const getSingleLayouts = catchAsync(async (req, res) => {
  const { id } = req.params;
  const layouts = await layoutServices.getLayoutById(id);

  sendResponse(res, {
    data: layouts,
    success: true,
    statusCode: httpStatus.OK,
    message: "All Layout successfull",
  });
});

const updateLayout = catchAsync(async (req, res) => {
  const { title, description, selected } = req.body as ILayout;
  const { id } = req.params;

  const payload: ILayout = {
    title,
    description,
    image: req.file?.path as string,
    selected,
  };

  const updatedField = Object.entries(payload).reduce(
    (acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }

      return acc;
    },
    {} as Record<string, unknown>
  );

  const layouts = await layoutServices.updateLayoutIntodb(updatedField, id);

  sendResponse(res, {
    data: layouts,
    success: true,
    statusCode: httpStatus.OK,
    message: "Layout update successfull",
  });
});

const deleteLayout = catchAsync(async (req, res) => {
  const { id } = req.params;

  await layoutServices.deleteLayoutFromdb(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Layout delete successfull",
  });
});

export const layoutController = {
  createLayout,
  getLayouts,
  updateLayout,
  deleteLayout,
  getSingleLayouts,
};
