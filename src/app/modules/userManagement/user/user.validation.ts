import { z } from "zod"

const userValidationSchema = z.object({
    body: z.object({
        password: z.string({
            required_error: "Password is required",
            invalid_type_error: "Password must be a string",
        }).max(20, { message: 'Password can not be more than 20 characters' }).optional(),
        // role: z.enum(["admin", "student", "faculty"]),
        // status: z.enum(["in-progress", "blocked"]).default('in-progress'),
        // isDeleted: z.boolean()
    })
})

export const userStatusValidationSchema = z.object({
    body: z.object({
        status: z.enum(["in-progress", "blocked"])
    })
})

export default userValidationSchema