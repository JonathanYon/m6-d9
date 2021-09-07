import mongoose from "mongoose";

const { Schema, model } = mongoose;

// const readTimeSchema = new Schema({
//   value: { type: Number, required: true },
//   unit: { type: String, required: true },
// });

// const authorSchem = new Schema({
//   name: { type: String, required: true },
//   avatar: { type: String, required: true },
// });

const blogSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      value: { type: Number, required: true },
      unit: { type: String, required: true },
    },
    authors: [{ type: Schema.Types.ObjectId, required: true, ref: "Author" }],
    content: { type: String, required: true },
    comments: [
      {
        comment: String,
      },
    ],
    likes: [{ type: Schema.Types.ObjectId, required: true, ref: "User" }],
  },
  { timestamps: true }
);

export default model(`Blog`, blogSchema);
