import jwt from "jsonwebtoken";
import authorModel from "../service/authors/schema.js";
import createHttpError from "http-errors";

const newToken = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.ACCESS_TOKEN,
      { expiresIn: "1 hour" },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    )
  );
