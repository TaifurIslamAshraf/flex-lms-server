import { Document, Types } from "mongoose";

export type IComment = {
  user: Types.ObjectId;
  qustion: string;
  qustionReplies: IComment[];
};

export type IReview = {
  user: Types.ObjectId;
  rating: number;
  comment: string;
  commentReplies?: [object];
};

export type IVideoResource = {
  title: string;
  url: string;
};

export type ICourseData = {
  videoTitle: string;
  videoDescription: string;
  videoUrl: string;
  videoSection: string;
  videoLength: number;
  videoPlayer: string;
  contentDrip: boolean;
  videoResource?: string;
  qustions: IComment[];
};

export type ICourse = {
  instructor: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  price: number;
  estimatedPrice?: number;
  thumbnail: string;
  tags: string;
  details: [{ title: string }];
  level: "beginner" | "intermediate" | "expert";
  demoUrl: string;
  category: Types.ObjectId;
  subcategory: Types.ObjectId;
  benefits: {
    title: string;
  }[];
  prerequistites?: { title: string }[];
  courseDuration: string;
  materialIncludes: string[];
  reviews: IReview[];
  courseData: ICourseData[];
  rating?: number;
  purchased?: number;
} & Document;

export type MulterFiles = {
  thumbnail?: Express.Multer.File[];
  materialIncludes?: Express.Multer.File[];
};
