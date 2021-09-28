import mongoose from "mongoose";
const { Schema, model } = mongoose;
import bcrypt from "bcrypt";

const authorSchema = new Schema(
  {
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

authorSchema.pre("save", async function (next) {
  //this is where we hash the password of our author
  const currentUser = this; // this in this case is indicating to the newly registered author
  const normalPassWord = currentUser.password;
  // currentUser.password = await bcrypt.hash(normalPassWord, 10);

  if (currentUser.isModified("password")) {
    currentUser.password = await bcrypt.hash(normalPassWord, 10); //this is similar to line 19 but also account for password change or reset or register
  }

  next();
});

export default model(`Author`, authorSchema);
