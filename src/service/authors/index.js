import { Router } from "express";
import authorsModel from "./schema.js";
import { authMidllware } from "../../auth/basic.js";
import { adminOnlyMiddleware } from "../../auth/admin.js";

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
authorsRouter.get("/me/stories", authMidllware, async (req, res, next) => {
  try {
    res.send(req.author);
  } catch (error) {
    next(createHttpError(404, `author ${req.params.Id} NOT found!!`));
  }
});
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
export default authorsRouter;
