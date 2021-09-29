import { Router } from "express";
import authorsModel from "./schema.js";
import { authMidllware } from "../../auth/basic.js";
import { adminOnlyMiddleware } from "../../auth/admin.js";
import createHttpError from "http-errors";

const authorsRouter = Router();

authorsRouter.post("/", async (req, res, next) => {
  try {
    const author = await authorsModel(req.body).save();
    res.send(author._id);
  } catch (error) {
    console.log(error);
    next();
  }
});

authorsRouter.get("/", authMidllware, async (req, res, next) => {
  try {
    // const query = q2m(req.query);
    // console.log(query);

    // const total = await authorsModel.countDocuments(query.criteria); //will have to finsish the query when i get the authors
    const authors = await authorsModel.find();

    res.send(authors);
  } catch (error) {
    next(error);
  }
});

authorsRouter.get(
  "/:Id",
  authMidllware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const author = await authorsModel.findById(req.params.Id);
      if (author) {
        res.send(author);
      } else {
        res.send(`blog ${req.params.Id} NOT found!!`);
      }
    } catch (error) {
      next(createHttpError(404, `author ${req.params.Id} NOT found!!`));
    }
  }
);
authorsRouter.put(
  "/:Id",
  authMidllware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const author = await authorsModel.findByIdAndUpdate(
        req.params.Id,
        req.body,
        {
          new: true,
        }
      );
      if (author) {
        res.send(author);
      } else {
        res.send(`blog ${req.params.Id} NOT found!!`);
      }
    } catch (error) {
      next(createHttpError(404, `author ${req.params.Id} NOT found!!`));
    }
  }
);
authorsRouter.delete(
  "/:Id",
  authMidllware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const author = await authorsModel.findByIdAndDelete(req.params.Id);
      if (author) {
        res.status(204).send(`Deleted!!`);
      } else {
        res.send(`${req.params.Id} NOT found!`);
      }
    } catch (error) {
      next(error);
    }
  }
);
//get the me
authorsRouter.get("/me/stories", authMidllware, async (req, res, next) => {
  try {
    const posts = await bl.find({ author: req.user._id.toString() });
    res.send(req.author);
  } catch (error) {
    next(createHttpError(404, `author ${req.params.Id} NOT found!!`));
  }
});

// authorsRouter.put("/update/me", authMidllware, async (req, res, next) => {

//   const author = await authorsModel.findByIdAndUpdate(req.author._id)
//   res.send(author);
// });

// register with Token
authorsRouter.post("/register", async (req, res, next) => {
  try {
    const newAuthor = await authorsModel(req.body);
    const { _id } = await newAuthor.save();
    res.status(201).send();
  } catch (error) {
    console.log(error);
    next(error);
  }
});
authorsRouter.post("/login", async (req, res, next) => {});

export default authorsRouter;
