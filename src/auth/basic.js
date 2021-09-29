import createHttpError from "http-errors";
import atob from "atob"; // used to decode base64
import authorModel from "../service/authors/schema.js";

export const authMidllware = async (req, res, next) => {
  //   console.log("header");
  try {
    if (!req.headers.authorization) {
      next(createHttpError(401, "Not Authorized"));
    } else {
      console.log(req.headers.authorization);

      const decodeUserPass = atob(req.headers.authorization.split(" ")[1]);
      // console.log(decodeUserPass);
      const [email, password] = decodeUserPass.split(":");

      const author = await authorModel.checkCredential(email, password);
      if (author) {
        req.author = author;
        next();
      } else {
        next(createHttpError(401, "Invalid Credential"));
      }
    }
  } catch (error) {
    console.log(error);
  }
};
