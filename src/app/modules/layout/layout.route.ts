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
  authorizeUser("admin", "superAdmin"),
  upload.single("image"),
  validateRequestWithJoi(createLayoutSchema),
  layoutController.createLayout
);

LayoutRouter.put(
  "/update-layout/:id",
  isAuthenticated,
  authorizeUser("admin", "superAdmin"),
  validateRequestWithJoi(updateLayoutSchema),
  upload.single("image"),
  layoutController.updateLayout
);

LayoutRouter.get(
  "/all-layout",
  isAuthenticated,
  authorizeUser("admin", "superAdmin"),
  layoutController.getLayouts
);

LayoutRouter.delete(
  "/delete-layout/:id",
  isAuthenticated,
  authorizeUser("superAdmin"),
  layoutController.deleteLayout
);

LayoutRouter.get("/single-layout/:id", layoutController.getSingleLayouts);

export default LayoutRouter;
