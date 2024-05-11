import jwt, { JwtPayload } from "jsonwebtoken"

export const createToken = (
    JwtPayload: { userId: string, role: string },
    secret: string,
    expireIn: string
) => {
    return jwt.sign(
        JwtPayload,
        secret,
        { expiresIn: expireIn }
    )
}


export const verifyToken = (token: string, secret: string) => {
    const decode = jwt.verify(token, secret) as JwtPayload
    return decode
}