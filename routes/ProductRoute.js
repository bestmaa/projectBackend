import express from "express";
import {
  createProductReview,
  deleteProduct,
  deleteProductReview,
  getAllProducts,
  GetProductDetail,
  getProductReviews,
  ProductCreate,
  updateProduct,
} from "../controller/ProductController.js";
import isAuthenticatedUser, { authorizeRoles } from "../middleware/auth.js";
const ProductRoute = express.Router();

ProductRoute.get("/getallproduct", getAllProducts);
ProductRoute.route("/admin/product/new").post(
  isAuthenticatedUser,
  authorizeRoles("admin"),
  ProductCreate
);
ProductRoute.route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);
ProductRoute.route("/product/:id").get(GetProductDetail);
ProductRoute.route("/review").put(isAuthenticatedUser, createProductReview);
ProductRoute.route("/reviews")
  .get(getProductReviews)
  .delete(isAuthenticatedUser, deleteProductReview);

export default ProductRoute;
