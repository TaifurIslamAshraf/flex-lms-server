import { Model, Schema, model } from "mongoose";
import { ICourseEngagement } from "./courseEngagement.interface";

const courseEngagementSchema = new Schema<ICourseEngagement>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  progress: {
    type: Number,
    default: 0,
  },
  videosCompleted: {
    type: [String], // Array of video id
    default: [],
  },
  currentVideo: {
    type: String,
  },
});

const CourseEngagementModel: Model<ICourseEngagement> = model(
  "CourseEngagement",
  courseEngagementSchema
);

export default CourseEngagementModel;
