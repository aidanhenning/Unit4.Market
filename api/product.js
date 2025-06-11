import express from "express";
import {
  getProductById,
  getProducts,
  getOrdersByProductId,
} from "#db/queries/product";
import requireUser from "#middleware/requireUser";

const router = express.Router();
export default router;

router.route("/").get(async (req, res, next) => {
  try {
    const products = await getProducts();
    res.send(products);
  } catch (err) {
    next(err);
  }
});

router.param("id", async (req, res, next, id) => {
  try {
    const product = await getProductById(id);
    if (!product) return res.status(404).send("Product not found");
    req.product = product;
    next();
  } catch (err) {
    next(err);
  }
});

router.route("/:id").get((req, res) => {
  res.send(req.product);
});

router.route("/:id/orders").get(requireUser, async (req, res, next) => {
  try {
    const orders = await getOrdersByProductId(req.product.id, req.user.id);
    res.send(orders);
  } catch (err) {
    next(err);
  }
});
