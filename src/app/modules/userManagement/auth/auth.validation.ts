import { z } from "zod";

export const loginValidationSchema = z.object({
    body: z.object({
        id: z.string().min(1),
        password: z.string().min(1)
    })
})

export const changePasswordValidationSchema = z.object({
    body: z.object({
        oldPassword: z.string({ required_error: "Old password is required!" }).min(1),
        newPassword: z.string({ required_error: "New password is required!" }).min(1),
    })
})

export const refreshTokenValidationSchema = z.object({
    cookies: z.object({
        refreshToken: z.string({ required_error: "Refresh token is required!" }).min(1)
    })
})

export const forgetPasswordValidationSchema = z.object({
    body: z.object({
        id: z.string({ required_error: "User id is required!" }).min(1)
    })
})

export const resetPasswordValidationSchema = z.object({
    body: z.object({
        id: z.string().min(1),
        newPassword: z.string().min(1)
    })
})

