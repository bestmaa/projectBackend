import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import mongoose from "mongoose";
import validator from "validator";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxlength: [30, "Name cannot exceed 30 characters"],
    minlength: [4, "Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your password"],
    minlength: [8, "pass should be greater than 8 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt:{
    type:Date,
    default:Date.now
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});
//mongo db pre save
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, 10);
  } else {
    next();
  }
});
//Jwt Token
userSchema.methods.getJWTtoken = function () {
  return jsonwebtoken.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
//compare password
userSchema.methods.comparePassword = async function (password) {
  let p = await bcryptjs.compare(password, this.password);
  return p;
};
//Generating password reset token
userSchema.methods.getResetPasswordToken = function () {
  //Gen Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  //Hashing  adding reset PasswordToken To user
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

const userModel = mongoose.model("user", userSchema);
export default userModel;
