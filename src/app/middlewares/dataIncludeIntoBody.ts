import { RequestHandler } from "express";

const formDataIncludeIntoBody: RequestHandler = (req, res, next) => {
    req.body = JSON.parse(req.body.data)
    next()
}

export default formDataIncludeIntoBody;