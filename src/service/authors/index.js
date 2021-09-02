import { Router } from "express";
import authorsModel from "./schema.js";

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

authorsRouter.get("/", async (req, res, next) => {
  try {
    // const query = q2m(req.query);
    // console.log(query);

    // const total = await authorsModel.countDocuments(query.criteria); //will have to finsish the query when i get the posts
    const authors = await authorsModel.find();

    res.send(authors);
  } catch (error) {
    next(error);
  }
});
export default authorsRouter;
