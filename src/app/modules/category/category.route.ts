import express from "express";

import { authorizeUser, isAuthenticated } from "../../middlewares/authGuard";
import { validateRequestWithJoi } from "../../middlewares/validateRequest";

import { categoryControllers } from "./category.controller";
import {
  createCategorySchema,
  createSubCategorySchema,
  updateCategorySchema,
} from "./category.validation";

export const categoryRoute = express.Router();

// get all category and subcategory
categoryRoute.get(
  "/category-subcategory",
  categoryControllers.getAllCategoryAndSubCategory
);

categoryRoute.post(
  "/create-category",
  validateRequestWithJoi(createCategorySchema),
  isAuthenticated,
  authorizeUser("admin", "instructor"),
  categoryControllers.createCategory
);
categoryRoute.get("/get-all-category", categoryControllers.getAllCategory);
categoryRoute.get(
  "/get-single-category/:slug",
  categoryControllers.getSignleCategory
);
categoryRoute.put(
  "/update-category",
  validateRequestWithJoi(updateCategorySchema),
  isAuthenticated,
  authorizeUser("admin", "instructor"),
  categoryControllers.updateCategory
);
categoryRoute.delete(
  "/delete-category/:id",
  isAuthenticated,
  authorizeUser("admin"),
  categoryControllers.deleteCategory
);

// sub category
export const subcategoryRoute = express.Router();

subcategoryRoute.post(
  "/create-subcategory",
  validateRequestWithJoi(createSubCategorySchema),
  isAuthenticated,
  authorizeUser("admin", "instructor"),
  categoryControllers.createSubcategory
);
subcategoryRoute.get(
  "/get-all-subcategory",
  categoryControllers.getAllSubcategory
);
subcategoryRoute.get(
  "/get-single-subcategory/:slug",
  categoryControllers.getSignleSubcategory
);
subcategoryRoute.get(
  "/get-subcategory-by-category/:category",
  categoryControllers.getSubcategoryByCategory
);
subcategoryRoute.put(
  "/update-subcategory",
  validateRequestWithJoi(updateCategorySchema),
  isAuthenticated,
  authorizeUser("admin", "instructor"),
  categoryControllers.updateSubcategory
);
subcategoryRoute.delete(
  "/delete-subcategory/:id",
  isAuthenticated,
  authorizeUser("admin"),
  categoryControllers.deleteSubcategory
);
