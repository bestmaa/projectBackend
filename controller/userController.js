import errorCatchAsync from "../middleware/errorCatchAsync.js";
import userModal from "../model/userModal.js";
import Errorhander from "../utils/errorHander.js";
import sendToken from "../utils/jwtToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import cloudinary from "cloudinary";
//register User
export const registerUser = errorCatchAsync(async (req, res, next) => {
  const mycloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
    folder:"avatars",
    width:150,
    crop:"scale"
  });
  const { name, email, password } = req.body;
  const user = await userModal.create({
    name,
    email,
    password,
    avatar: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
  });
  sendToken(user, 201, res);
});
// Login User
export const loginUser = errorCatchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new Errorhander("Please Enter Email and Password ", 400));
  }
  const user = await userModal.findOne({ email }).select("+password");
  if (!user) {
    return next(new Errorhander("Invalid email Or Password", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  // console.log("sasd",await isPasswordMatched);
  if (!isPasswordMatched) {
    return next(new Errorhander("Invalid email Or Password", 401));
  } else {
    sendToken(user, 200, res);
  }
});
// logOut User
export const logout = errorCatchAsync(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

//Forgot Password
export const forgotPassword = errorCatchAsync(async (req, res, next) => {
  const user = await userModal.findOne({ email: req.body.email });
  if (!user) {
    return next(new Errorhander("User Not Found", 404));
  }
  //resetPassword
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  const message = `your password reset token is :-\n\n\n ${resetPasswordUrl} \n\n if you have not requested this email then, please ignore it `;
  try {
    await sendEmail({
      email: user.email,
      subject: `Product site Password recovery `,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email send to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new Errorhander(error.message, 500));
  }
});

//reset password

export const resetPassword = errorCatchAsync(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await userModal.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new Errorhander(
        "reset password token is invalid or has been expired ",
        404
      )
    );
  }
  if (req.body.password !== req.body.conformPassword) {
    return next(new Errorhander("password does not match", 404));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
});

//get User Detail
export const getUserDetails = errorCatchAsync(async (req, res, next) => {
  const user = await userModal.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});
//update user pass
export const updatePassword = errorCatchAsync(async (req, res, next) => {
  const user = await userModal.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new Errorhander("old password is incorrect", 404));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new Errorhander("passwor does not match ", 404));
  }

  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res);
});
//update user profile
export const updateUserProfile = errorCatchAsync(async (req, res, next) => {
  const newProfileData = {
    name: req.body.name,
    email: req.body.email,
  };
if(req.body.avatar !==""){
  const user= await userModal.findById(req.user.id);
  const imageId=user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(imageId)
  const myCloud =await cloudinary.v2.uploader.upload(req.body.avatar,{
    folder:"avatars",
    width:150,
    crop:"scale"
  })
  newProfileData.avatar={
    public_id:myCloud.public_id,
    url:myCloud.secure_url,
  }
}

  const user = await userModal.findByIdAndUpdate(req.user.id, newProfileData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

//Get All Users for Admin
export const getAllUser = errorCatchAsync(async (req, res, next) => {
  const user = await userModal.find();

  res.status(200).json({
    success: true,
    user,
  });
});

//Get single User for Admin
export const getOneUser = errorCatchAsync(async (req, res, next) => {
  const user = await userModal.findById(req.params.id);
  if (!user) {
    return next(
      new Errorhander(`user does not exist with id :${req.params.id}`)
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});
// update user role by admin
export const updateUserRole = errorCatchAsync(async (req, res, next) => {
  const newProfileData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  const user = await userModal.findByIdAndUpdate(
    req.params.id,
    newProfileData,
    { new: true, runValidators: true, useFindAndModify: false }
  );

  if (!user) {
    return next(new Errorhander(`user does not exit:-${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    message:"user update by admin",
    user,
  });
});
// delet user by admin
export const deleteUser = errorCatchAsync(async (req, res, next) => {
  const user = await userModal.findById(req.params.id);

  if (!user) {
    return next(new Errorhander(`user does not exit:-${req.params.id}`, 404));
  }
  await user.remove();
  res.status(200).json({
    success: true,
    message:"user delete",
    user,
  });
});
