import { Document, Schema } from "mongoose";

export type ICategory = {
  name: string;
  slug: string;
} & Document;

export type ISubCategory = {
  name: string;
  slug: string;
  category: Schema.Types.ObjectId;
} & Document;
