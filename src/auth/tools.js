import jwt from "jsonwebtoken";
import authorModel from "../service/authors/schema.js";
import createHttpError from "http-errors";

//access token
const newToken = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.ACCESS_TOKEN,
      { expiresIn: "3 hour" },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    )
  );

// refresh token
const newRefreshToken = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.REFRESH_TOKEN,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    )
  );

export const verifyToken = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decodedToken) => {
      if (err) reject(err);
      resolve(decodedToken);
    })
  );

export const jwtAuthentication = async (author) => {
  const accessToken = await newToken({ _id: author._id });
  const refreshToken = await newRefreshToken({ _id: author._id });

  author.refreshT = refreshToken;
  await author.save();
  return { accessToken, refreshToken };
};
