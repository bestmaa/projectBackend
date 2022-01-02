import errorCatchAstnc from "../middleware/errorCatchAsync.js";
import ProductModul from "../model/productModal.js";
import Errorhander from "../utils/errorHander.js";
import Apifeatures from "../utils/apiFeatures.js";

//Create Product -Admin
export const ProductCreate = errorCatchAstnc(async (req, res, next) => {
  req.body.user = req.user.id;
  const Product = await ProductModul.create(req.body);

  res.status(201).send({
    success: true,
    CreatedProduct: Product,
  });
});
// Get All Products
export const getAllProducts = errorCatchAstnc(async (req, res, next) => {
  const perPage = 8;
  const productCount = await ProductModul.countDocuments();
  const apifeatures = new Apifeatures(ProductModul.find(), req.query)
    .search()
    .filter()
    .pagination(perPage);
  const Products = await apifeatures.query;

  res.send({
    success: true,
    Products,
    productCount,
    perPage,
  });
});

// Update Product -- Admin

export const updateProduct = errorCatchAstnc(async (req, res, next) => {
  let product = await ProductModul.findById(req.params.id);
  if (!product) {
    return next(new Errorhander("Product Not Found", 404));
  }
  product = await ProductModul.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json({
    success: true,
    product,
  });
});
export const deleteProduct = errorCatchAstnc(async (req, res, next) => {
  const product = await ProductModul.findById(req.params.id);
  if (!product) {
    return next(new Errorhander("Product Not Found", 404));
  }
  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product Delete success",
  });
});
export const GetProductDetail = errorCatchAstnc(async (req, res, next) => {
  const product = await ProductModul.findById(req.params.id);
  if (!product) {
    return next(new Errorhander("Product Not Found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});
// create new reviwe || update reivew
export const createProductReview = errorCatchAstnc(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const reviwe = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await ProductModul.findById(productId);

  const isReviwes = product.reviews.find(
    (reviweId) => reviweId.user.toString() === req.user._id.toString()
  );
  if (isReviwes) {
    product.reviews.forEach((reviweId) => {
      if (reviweId.user.toString() === req.user._id.toString()) {
        reviweId.rating = rating;
        reviweId.comment = comment;
      }
    });
  } else {
    product.reviews.push(reviwe);
    product.numberOfReviws = product.reviews.length;
  }
  let avg = 0;
  product.reviews.forEach((allReviwe) => {
    avg += allReviwe.rating;
  });
  product.ratings = avg / product.reviews.length;
  await product.save({ validateBeforSave: false });
  res.status(200).json({
    success: true,
  });
});

//Get Reviews of product
export const getProductReviews = errorCatchAstnc(async (req, res, next) => {
  const product = await ProductModul.findById(req.query.id);

  if (!product) {
    return next(new Errorhander("Product Not Found", 404));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});
//delete Reviews
export const deleteProductReview = errorCatchAstnc(async (req, res, next) => {
  const product = await ProductModul.findById(req.query.productId);

  if (!product) {
    return next(new Errorhander("Product Not Found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  const rating = avg / reviews.length;
  const numberOfReviws = reviews.length;
  await ProductModul.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      rating,
      numberOfReviws,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
