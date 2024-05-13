import { Document, Types } from "mongoose";

export type ICourseEngagement = {
  user: Types.ObjectId;
  course: Types.ObjectId;
  enrolledAt: Date;
  completed: boolean;
  progress: number;
  videosCompleted: string[];
  currentVideo: string | null;
} & Document;
