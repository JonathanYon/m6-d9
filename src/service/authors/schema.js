import mongoose from "mongoose";
const { Schema, model } = mongoose;

const authorSchema = new Schema({
  name: { type: String, required: true },
  avatar: { type: String, required: true },
});

export default model(`Author`, authorSchema);
