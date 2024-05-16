import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";
import config from "../../../config/config";
import { IUser, Iinstructor } from "./user.interface";

const instructorSchema = new Schema<Iinstructor>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "User Password is Required"],
      minlength: [6, "Password Must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "user", "instructor"],
      default: "user",
    },
    instructor: {
      type: instructorSchema,
      // required: function (this: IUser) {
      //   return this.role === "instructor";
      // },
    },
    avatar: String,
    address: String,
    fatherName: String,
    motherName: String,
    district: String,
    postCode: String,
  },
  {
    timestamps: true,
  }
);

//hash pssword
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//access token
userSchema.methods.accessToken = function () {
  return jwt.sign(
    { _id: this._id },
    config.token_data.access_token_secret as string,
    {
      expiresIn: config.token_data.access_token_expires,
    }
  );
};

//refresh token
userSchema.methods.refreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    config.token_data.refresh_token_secret as string,
    {
      expiresIn: "30d",
    }
  );
};

//compare password
userSchema.methods.comparePassword = async function (
  entredPassword: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(entredPassword, this.password);
  return isMatch;
};

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;
