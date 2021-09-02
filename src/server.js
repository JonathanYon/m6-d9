import express from "express";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import blogsRouter from "./service/blog/index.js";
import authorsRouter from "./service/authors/index.js";

const port = process.env.PORT || 5000;
const server = express();

server.use(express.json());

server.use("/blogs", blogsRouter);
server.use("/authors", authorsRouter);

mongoose.connect(process.env.MONGOS_CON_LOCAL);
mongoose.connection.on(`connected`, () => {
  // the string "connected" 👆☝ has to be "connected" nothing more nothing less
  console.log(`🎁 mongo connected Successfully!!`);
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`server running on: ${port}`);
  });
});

mongoose.connection.on(`error`, (err) => {
  console.log(`Mongo Error: ${err}`);
});

//-------------------------OR----------------------------------
// THE CODE BELLOW ALSO WORK //

// mongoose
//   .connect(process.env.MONGOS_CON_LOCAL)
//   .then(() => {
//     server.listen(port, () => {
//       console.table(listEndpoints(server));
//       console.log(`server running on: ${port}`);
//     });
//   })
//   .catch(console.log);
