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

const verifyToken = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.REFRESH_TOKEN, (err, decodedToken) => {
      if (err) reject(err);
      resolve(decodedToken);
    })
  );

export const jwtAuthentication = async (user) => {
  const accessToken = await newToken({ _id: user._id });
  console.log("toke=>", accessToken);
  return accessToken;
};
