import { Document } from "mongoose";

export type IComment = {
  user: object;
  qustion: string;
  qustionReplies: IComment[];
} & Document;

export type IReview = {
  user: object;
  rating: number;
  comment: string;
  commentReplies?: [object];
} & Document;

export type CourseResource = {
  title: string;
  url: string;
} & Document;

export type ICourseData = {
  videoTitle: string;
  videoDescription: string;
  videoUrl: string;
  videoSection: string;
  videoLength: number;
  videoPlayer: string;

  suggestion: string;
  qustions: IComment[];
} & Document;

export type ICourse = {
  name: string;
  description: string;
  price: number;
  estimatedPrice?: number;
  thumbnail: {
    public_id: string;
    url: string;
  };
  tags: string;
  level: string;
  demoUrl: string;
  links: CourseResource[];
  benefits: {
    title: string;
  }[];
  prerequistites: { title: string }[];
  reviews: IReview[];
  courseData: ICourseData[];
  rating?: number;
  purchased?: number;
} & Document;
