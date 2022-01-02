import orderModel from "../model/orderModel.js ";
import errorCatchAstnc from "../middleware/errorCatchAsync.js";
import ProductModul from "../model/productModal.js";
import Errorhander from "../utils/errorHander.js";

//create new Order
export const newOrder = errorCatchAstnc(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  const order = await orderModel.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

//get single order
export const getSingleOrder = errorCatchAstnc(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id).populate("user", "name email");
    
  if (!order) {
    return next(new Errorhander("Order not found With This id", 404));
  }
  res.status(200).json({
    success: true,
    order,
  });
});
//get logged in user order
export const myOrders = errorCatchAstnc(async (req, res, next) => {
  const order = await orderModel.find({ user: req.user._id });
  console.log(req.user._id);
  res.status(200).json({
    success: true,
    order,
  });
});
//get all order by admin 
export const getAllOrdersByAdmin = errorCatchAstnc(async (req, res, next) => {
  const orders = await orderModel.find();
  let totleAmount=0;
  orders.forEach(allorder=>{
    totleAmount+=allorder.totalPrice
  })
  res.status(200).json({
    success: true,
    totleAmount,
    orders,
  });
});
//update all status by admin 
export const updateOrdersByAdmin = errorCatchAstnc(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);

  if (!order) {
    return next(new Errorhander("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new Errorhander("You have already delivered this order", 400));
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (ord) => {
      await stockUpdate(ord.product, ord.quantity);
    });
  }
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function stockUpdate(id, quantity) {
  const product = await ProductModul.findById(id);

  product.stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

// delete Order by Admin
export const deleteOrderByAdmin = errorCatchAstnc(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);

  if (!order) {
    return next(new Errorhander("Order not found with this Id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});