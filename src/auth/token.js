import createHttpError from "http-errors";
import { verifyToken } from "./tools";
import authorModel from "../service/authors/schema.js";

export const jwtAuthMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(createHttpError(401, "Try to Login"));
  } else {
    try {
      const token = req.headers.authorization.replace("Bearer ", "");
      console.log(token);
      const decode = await verifyToken(token);
      console.log(decode);
      const author = await authorModel.findById(decode._id);
      if (author) {
        req.author = author;
        next();
      } else {
        next(createHttpError(401, "Unauthorized"));
      }
    } catch (error) {
      console.log(error);
      next(createHttpError(401, "Unauthorized"));
    }
  }
};
