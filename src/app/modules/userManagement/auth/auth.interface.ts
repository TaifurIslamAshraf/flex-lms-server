import { Document, Types } from "mongoose";

export type Iinstructor = {
  title: string;
  description: string;
} & Document;

export type IUser = {
  name: string;
  phone: string;
  email: string;
  password: string;
  role: "admin" | "user" | "instructor" | "superAdmin";
  instructor?: Iinstructor;
  avatar?: string;
  address?: string;
  fatherName?: string;
  motherName?: string;
  district?: string;
  postCode?: string;
  cartItems: Types.ObjectId[];
  comparePassword: (entredPassword: string) => Promise<boolean>;
  accessToken: () => string;
  refreshToken: () => string;
} & Document;

export type IUserSubset = {
  name: string;
  phone: string;
  email: string;
  password: string;
};

export type ILogin = {
  email: string;
  password: string;
};

export type IActivation = {
  token: string;
  activationCode: string;
};
