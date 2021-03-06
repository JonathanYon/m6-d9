import { Router } from "express";
import authorsModel from "./schema.js";
import { authMidllware } from "../../auth/basic.js";
import createHttpError from "http-errors";
import { jwtAuthentication, refreshTokenAuth } from "../../auth/tools.js";
import { jwtAuthMiddleware } from "../../auth/token.js";
import blogModel from "../blog/schema.js";

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

// authorsRouter.get("/", async (req, res, next) => {
//   try {
//     // const query = q2m(req.query);
//     // console.log(query);

//     // const total = await authorsModel.countDocuments(query.criteria); //will have to finsish the query when i get the authors
//     const authors = await authorsModel.find();

//     res.send(authors);
//   } catch (error) {
//     next(error);
//   }
// });

// authorsRouter.get("/:Id", async (req, res, next) => {
//   try {
//     const author = await authorsModel.findById(req.params.Id);
//     if (author) {
//       res.send(author);
//     } else {
//       res.send(`blog ${req.params.Id} NOT found!!`);
//     }
//   } catch (error) {
//     next(createHttpError(404, `author ${req.params.Id} NOT found!!`));
//   }
// });
// authorsRouter.put("/:Id", async (req, res, next) => {
//   try {
//     const author = await authorsModel.findByIdAndUpdate(
//       req.params.Id,
//       req.body,
//       {
//         new: true,
//       }
//     );
//     if (author) {
//       res.send(author);
//     } else {
//       res.send(`blog ${req.params.Id} NOT found!!`);
//     }
//   } catch (error) {
//     next(createHttpError(404, `author ${req.params.Id} NOT found!!`));
//   }
// });
// authorsRouter.delete(
//   "/:Id",

//   async (req, res, next) => {
//     try {
//       const author = await authorsModel.findByIdAndDelete(req.params.Id);
//       if (author) {
//         res.status(204).send(`Deleted!!`);
//       } else {
//         res.send(`${req.params.Id} NOT found!`);
//       }
//     } catch (error) {
//       next(error);
//     }
//   }
// );
//get the me
authorsRouter.get("/me/stories", jwtAuthMiddleware, async (req, res, next) => {
  try {
    const posts = await blogModel.find({ authors: req.author._id.toString() });
    res.send(posts);
  } catch (error) {
    next(createHttpError(404, `author ${req.params.Id} NOT found!!`));
  }
});

// /authors/12345/blogs/1234567

// DELETE jwtMiidle, onlyAuthor, /authors/:authorId/blogs/blogid12345/comments/1208371293
//jwtmiddle should be = authorid

// DELETE /blogs/123123

authorsRouter.put(
  "/blog/:blogId",
  jwtAuthMiddleware,
  async (req, res, next) => {
    try {
      const blog = await blogModel.findOneAndUpdate(
        { _id: req.params.blogId, authors: req.author._id },
        { ...req.body },
        { new: true }
      );
      if (blog) {
        res.send(blog);
      } else {
        next(createHttpError(401, "????Unauthorized to change this blog"));
      }
    } catch (error) {
      next(error);
    }
  }
);

authorsRouter.delete(
  "/blog/:blogId",
  jwtAuthMiddleware,
  async (req, res, next) => {
    try {
      const blog = await blogModel.findOneAndDelete({
        _id: req.params.blogId,
        authors: req.author._id,
      });
      if (blog) {
        res.send("??? gone for good!!");
      } else {
        res.send(`blog ${req.params.blogId} NOT found!/or it's Not ???? yours`);
      }
    } catch (error) {
      next(
        createHttpError(401, "???? Why would you delete a post thats NOT yours?")
      );
    }
  }
);

authorsRouter.get("/me", jwtAuthMiddleware, async (req, res, next) => {
  try {
    res.send(req.author);
  } catch (error) {
    next(error);
  }
});

authorsRouter.put("/me", jwtAuthMiddleware, async (req, res, next) => {
  try {
    const author = await authorsModel.findByIdAndUpdate(
      req.author._id,
      { ...req.body },
      { new: true }
    );

    res.send(author);
  } catch (error) {
    next(error);
    console.log(error);
  }
});

authorsRouter.delete("/me", jwtAuthMiddleware, async (req, res, next) => {
  try {
    const author = await authorsModel.findByIdAndDelete(req.author._id);
    res.send("Can't belive you just did that????????????");
  } catch (error) {
    next(error);
  }
});

// register with Token
authorsRouter.post("/register", async (req, res, next) => {
  try {
    const newAuthor = await authorsModel(req.body);
    const { _id } = await newAuthor.save();
    res.status(201).send(_id);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

authorsRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const author = await authorsModel.checkCredential(email, password);
    if (author) {
      const { accessToken, refreshToken } = await jwtAuthentication(author);
      res.send({ accessToken, refreshToken });
    } else {
      next(createHttpError(401, "invalid email and/or password"));
    }
  } catch (error) {
    console.log(error);
    next(createHttpError(401, "Check your credential again"));
  }
});

authorsRouter.post("/refresh", async (req, res, next) => {
  try {
    const { fromBody } = req.body;
    const { accessToken, refreshToken } = await refreshTokenAuth(fromBody);
    console.log(accessToken, refreshToken);
    res.send({ accessToken, refreshToken });
  } catch (error) {
    next(createHttpError(401, "Login error"));
  }
});

export default authorsRouter;
