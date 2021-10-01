import createHttpError from "http-errors";
import blogModels from "../service/blog/schema.js";

export const adminOnlyMiddleware = async (req, res, next) => {
  if (req.author.role === "Admin") {
    next();
  } else {
    next(createHttpError(403, "Not authorized dude!!"));
  }
};
