import express from "express";
import { upload } from "../../config/multer.config";
import { authorizeUser, isAuthenticated } from "../../middlewares/authGuard";
import { validateRequestWithJoi } from "../../middlewares/validateRequest";
import { layoutController } from "./layout.controller";
import { createLayoutSchema, updateLayoutSchema } from "./layout.validation";

const LayoutRouter = express.Router();

LayoutRouter.post(
  "/create-layout",
  isAuthenticated,
  authorizeUser("admin"),
  upload.single("image"),
  validateRequestWithJoi(createLayoutSchema),
  layoutController.createLayout
);

LayoutRouter.put(
  "/update-layout/:id",
  isAuthenticated,
  authorizeUser("admin"),
  upload.single("image"),
  validateRequestWithJoi(updateLayoutSchema),
  layoutController.updateLayout
);

LayoutRouter.get(
  "/all-layout",
  isAuthenticated,
  authorizeUser("admin"),
  layoutController.getLayouts
);

LayoutRouter.delete(
  "/delete-layout",
  isAuthenticated,
  authorizeUser("admin"),
  layoutController.deleteLayout
);

LayoutRouter.get("/single-layout/:id", layoutController.getSingleLayouts);

export default LayoutRouter;
