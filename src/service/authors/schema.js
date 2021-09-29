import mongoose from "mongoose";
const { Schema, model } = mongoose;
import bcrypt from "bcrypt";

const authorSchema = new Schema(
  {
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["Author", "Admin"],
      default: "Author",
    },
  },
  { timestamps: true }
);

// password hash
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

// to update the logged user its own details
authorSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();
  console.log("🤗", update);
  const { password: plainPassword } = update;
  if (plainPassword) {
    const password = await bcrypt.hash(plainPassword, 10);
    this.setUpdate({ ...update, password });
  }
});

// project password(removing password from the get route)

authorSchema.methods.toJSON = function () {
  const userDetail = this;
  const userObject = userDetail.toObject();
  delete userObject.password;
  return userObject;
};

// comparing plain password & email to the hashed one
authorSchema.statics.checkCredential = async function (email, plainPassword) {
  // lets take this func to the basic.js
  const author = await this.findOne({ email }); //searching by email
  console.log(author);
  if (author) {
    const isMatch = await bcrypt.compare(plainPassword, author.password);
    console.log(isMatch);
    if (isMatch) return author;
    else null;
  } else {
    return null;
  }
};

export default model(`Author`, authorSchema);
