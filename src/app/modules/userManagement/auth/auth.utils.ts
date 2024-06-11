import { CookieOptions, Response } from "express";

import config from "../../../config/config";
import { IUser } from "./auth.interface";

//parse env value to inregate with falback value
const accessTokenExpire = parseInt(
  config.token_data.access_token_cookie_expires || "1",
  10
);
const refreshTokenExpire = parseInt(
  config.token_data.refresh_token_cookie_expires || "1",
  10
);

//options for cookis
export const accessTokenCookieOptions: CookieOptions = {
  expires: new Date(Date.now() + accessTokenExpire),
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

export const refreshTokenCookieOptions: CookieOptions = {
  expires: new Date(Date.now() + refreshTokenExpire),
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.accessToken();
  const refreshToken = user.refreshToken();

  // res.cookie("access_token", accessToken, accessTokenCookieOptions);
  // res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);

  res.locals.user = user;

  res.status(statusCode).json({
    success: true,
    message: "User login successfully",
    user,
    accessToken,
    refreshToken,
    expireIn: new Date().setTime(
      new Date().getTime() + parseInt(config.token_data.next_auth_expires!)
    ),
  });
};
