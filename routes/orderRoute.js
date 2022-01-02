import express from "express";
import {
  deleteOrderByAdmin,
  getAllOrdersByAdmin,
  getSingleOrder,
  myOrders,
  newOrder,
  updateOrdersByAdmin,
} from "../controller/orderController.js";
import isAuthenticatedUser, { authorizeRoles } from "../middleware/auth.js";
const orderRouter = express.Router();

orderRouter.route("/order/new").post(isAuthenticatedUser, newOrder);
orderRouter.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
orderRouter.route("/orders/me").get(isAuthenticatedUser, myOrders);
orderRouter
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrdersByAdmin);
orderRouter
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrdersByAdmin);
orderRouter
  .route("/admin/order/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrderByAdmin);
 
export default orderRouter;
