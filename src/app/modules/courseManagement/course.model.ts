import { Model, Schema, model } from "mongoose";
import {
  IComment,
  ICourse,
  ICourseData,
  IReview,
  IVideoResource,
} from "./course.interface";

const reviewSchema = new Schema<IReview>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: String,
  commentReplies: {
    type: [Object],
  },
});

const videoResource = new Schema<IVideoResource>({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const commentSchema = new Schema<IComment>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  qustion: {
    type: String,
  },
  qustionReplies: {
    type: [Object],
  },
});

const courseDataSchema = new Schema<ICourseData>({
  videoTitle: {
    type: String,
    required: true,
  },
  videoDescription: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },

  videoSection: {
    type: String,
    required: true,
  },
  videoLength: {
    type: Number,
    required: true,
  },
  videoPlayer: {
    type: String,
    required: true,
  },

  videoResource: {
    type: [videoResource],
  },

  contentDrip: {
    type: Boolean,
    default: false,
  },
  qustions: {
    type: [commentSchema],
  },
});

const courseSchema = new Schema<ICourse>(
  {
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
      required: [true, "subCategory id is required"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category id is required"],
    },

    price: {
      type: Number,
      required: true,
    },
    estimatedPrice: {
      type: Number,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    tags: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "expert"],
      required: true,
    },
    demoUrl: {
      type: String,
      required: true,
    },
    details: {
      type: [{ title: String }],
      required: true,
    },
    benefits: {
      type: [{ title: String }],
      required: true,
    },
    prerequistites: {
      type: [{ title: String }],
      required: true,
    },
    courseDuration: {
      type: String,
      required: true,
    },
    materialIncludes: {
      type: [String],
    },
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    rating: {
      type: Number,
      default: 0,
    },
    purchased: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

courseSchema.index(
  {
    name: "text",
    description: "text",
    slug: "text",
    tags: "text",
  },
  {
    weights: {
      name: 5,
      description: 2,
      slug: 5,
      tags: 4,
    },
  }
);

const courseModel: Model<ICourse> = model("Course", courseSchema);
export default courseModel;
