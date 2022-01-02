import express from "express";
import {
  deleteUser,
  forgotPassword,
  getAllUser,
  getOneUser,
  getUserDetails,
  loginUser,
  logout,
  registerUser,
  resetPassword,
  updatePassword,
  updateUserProfile,
  updateUserRole,
} from "../controller/userController.js";
import isAuthenticatedUser, { authorizeRoles } from "../middleware/auth.js";
const userRouter = express.Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/password/forgot").post(forgotPassword);
userRouter.route("/password/reset/:token").put(resetPassword);
userRouter.route("/logout").get(logout);
userRouter.route("/me").get(isAuthenticatedUser, getUserDetails);
userRouter.route("/password/update").put(isAuthenticatedUser, updatePassword);
// userRouter.route("/password/update").put(isAuthenticatedUser, updatePassword);
userRouter.route("/me/update").put(isAuthenticatedUser, updateUserProfile);
userRouter
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);
userRouter
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getOneUser)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

export default userRouter;
