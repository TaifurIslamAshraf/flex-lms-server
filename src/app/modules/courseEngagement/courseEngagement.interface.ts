import { Document, Types } from "mongoose";

export type ICourseEngagement = {
  user: Types.ObjectId;
  course: Types.ObjectId;
  enrolledAt: Date;
  completed: boolean;
  progress: number;
  videosCompleted?: string[];
  currentVideo?: string | null;
} & Document;

export type ISyncCourseEngagement = {
  course: string;
  completed?: boolean;
  progress?: number;
  videosCompleted?: string[];
  currentVideo?: string | null;
};

export type ICreateCourseEngagement = {
  user: Types.ObjectId;
  course: Types.ObjectId[];
};

export type IPurchasedCourses = {
  course: Types.ObjectId;
  price: number;
}[];
