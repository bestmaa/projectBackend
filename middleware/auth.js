import jsonwebtoken from "jsonwebtoken";
import userModel from "../model/userModal.js";
import Errorhander from "../utils/errorHander.js";
import errorCatchAsync from "./errorCatchAsync.js";

const isAuthenticatedUser = errorCatchAsync(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new Errorhander("Plaase Login  To access This resource", 401));
  }
  const decodedData = jsonwebtoken.verify(token, process.env.JWT_SECRET);
  req.user = await userModel.findById(decodedData.id);
  next();
});

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new Errorhander(
          `Role: ${req.user.role} is not allowed to access this resouce`,
          403
        )
      );
    }else{
        next()
    }
  };
};

export default isAuthenticatedUser;
