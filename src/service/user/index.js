import { Router } from "express";
import userModel from "./schema.js";

const usersRouter = Router();

usersRouter.post("/", async (req, res, next) => {
  try {
    const user = await userModel(req.body).save();

    res.send(user._id);
  } catch (error) {
    console.log(error);
    next();
  }
});

usersRouter.get("/", async (req, res, next) => {
  try {
    // const query = q2m(req.query);
    // console.log(query);

    // const total = await userModel.countDocuments(query.criteria); //will have to finsish the query when i get the users
    const users = await userModel.find();

    res.send(users);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/:Id", async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.Id);
    if (user) {
      res.send(user);
    } else {
      res.send(`blog ${req.params.Id} NOT found!!`);
    }
  } catch (error) {
    next(createHttpError(404, `user ${req.params.Id} NOT found!!`));
  }
});
usersRouter.put("/:Id", async (req, res, next) => {
  try {
    const user = await userModel.findByIdAndUpdate(req.params.Id, req.body, {
      new: true,
    });
    if (user) {
      res.send(user);
    } else {
      res.send(`blog ${req.params.Id} NOT found!!`);
    }
  } catch (error) {
    next(createHttpError(404, `user ${req.params.Id} NOT found!!`));
  }
});
usersRouter.delete("/:Id", async (req, res, next) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.Id);
    if (user) {
      res.status(204).send(`Deleted!!`);
    } else {
      res.send(`${req.params.Id} NOT found!`);
    }
  } catch (error) {
    next(error);
  }
});
export default usersRouter;
